import { I18nTranslations } from './../../generated/i18n.generated';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Currency,
  LogNote,
  Order,
  Partner,
  PartnerInvoice,
  PaymentMethod,
  PaymentPartner,
} from 'src/entities';
import { In, Repository, Brackets } from 'typeorm';
import { CreatePaymentManyInvoiceDTO, CreatePaymentPartnerDto } from './dto/create-payment-partner.dto';
import { RequestWithUser } from 'src/common/interfaces';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { I18nService } from 'nestjs-i18n';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { InvoiceStatusEnum } from '../invoices/enum/invoice-status.enum';
import { DEFAULT_LIMIT_PAGINATE, ROLE_NAME } from 'src/constants';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from 'src/common/dtos';
import { attendDescription } from 'src/common/utils/attendDes';
import { DataLogNote } from 'src/common/utils/logNotesClass';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { querySearch } from 'src/common/utils/querySearch';

@Injectable()
export class PaymentPartnerService {
  constructor(
    @InjectRepository(PaymentPartner)
    private readonly paymentPartnerRepository: Repository<PaymentPartner>,

    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(PartnerInvoice)
    private readonly partnerInvoiceRepository: Repository<PartnerInvoice>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async validateEntity(
    id: number,
    entityRepository: Repository<any>,
    entityName: string,
    lang: string,
    relations?: any,
  ): Promise<any> {
    const entity = await entityRepository.findOne({
      where: { id },
      relations: relations,
    });

    if (!entity) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.Cannot_find', {
          lang: lang,
          args: { name: entityName },
        }),
      );
    }

    return entity;
  }

  async create(
    body: CreatePaymentPartnerDto,
    header,
    req: RequestWithUser,
    attachment: any,
  ) {
    try {
      const lang = header.lang;
      const userId = +req.user.userId;
      const { invoicePartnerId, methodId, currencyId, amount } = body;
      const invoicePartner = await this.validateEntity(
        +invoicePartnerId,
        this.partnerInvoiceRepository,
        'Partner Invoice',
        lang,
        {
          order: true,
          invoice: true,
          customerPartner: {
            partnerCustomer: true,
            partners: true,
            partnerOrder: true,
          },
        },
      );

      if (
        +invoicePartner.status !== InvoiceStatusEnum.Request_Sending &&
        +invoicePartner.status != InvoiceStatusEnum?.Over_Due &&
        +invoicePartner.status != InvoiceStatusEnum?.Created
      ) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.Can_not_create_payment_for_this_invoice',
            { lang: lang },
          ),
        );
      }

      if (Number(amount) !== Number(invoicePartner?.commisson_amount)) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.payment_amout_invalid', {
            lang: lang,
          }),
        );
      }
      await this.validateEntity(
        +currencyId,
        this.currencyRepository,
        'Currency',
        lang,
      );
       await this.validateEntity(
        +methodId,
        this.paymentMethodRepository,
        'Payment Method',
        lang,
      );

      let description: any;
      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = attachment.filter(
          (items: any) => !items.mimetype.startsWith('image/'),
        );
        description = await attendDescription(
          imageAttach,
          fileAttach,
          body.notes,
        );
      }

      const payload: any = {
        amount: Number(amount),
        transactionId: body.transaction,
        method: body.methodId,
        paymentDate: body.paymentDate,
        notes: description ?? body.notes,
        currency: body.currencyId,
        order: +invoicePartner.order.id,
        invoicePartner: +invoicePartnerId,
        partner: +invoicePartner?.customerPartner?.partners?.id,
        user: userId,
      };

      const paymentPartner = await this.paymentPartnerRepository.save(payload);

      if (attachment && attachment?.length > 0) {
        let LogNoteImage = [];
        attachment.forEach((item: any) => {
          const logNote: any = {
            object: LogNoteObject.PAYMENT_PARTNER,
            objectId: Number(paymentPartner.id),
            action: item?.mimetype.startsWith('image/')
              ? LogNoteActions.UPLOAD_FILE
              : LogNoteActions.UPLOAD_FILE_RAW,
            user: +userId,
            attachment: item?.filename,
          };

          LogNoteImage.push(logNote);
        });

        await this.logNoteRepository.save(LogNoteImage);
      }

      const data = {
        oldValue: null,
        newValue: JSON.stringify(paymentPartner),
      };

      const logNotePayment = new DataLogNote(
        +userId,
        LogNoteObject.PAYMENT_PARTNER,
        Number(paymentPartner?.id),
        LogNoteActions.CREATE,
        data,
      );

      await this.logNoteRepository.save(logNotePayment);

      if (paymentPartner) {
        await this.partnerInvoiceRepository.save({
          ...invoicePartner,
          status: InvoiceStatusEnum.Completed,
        });
      }
      return {
        data: payload,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAll(pagination: any, req: RequestWithUser) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
        currencyId,
        methodId,
        valueFrom,
        valueTo,
        startTime,
        endTime,
      } = pagination;

      const userId = Number(req.user.userId);
      const kind = req.user.kind;

      const data = this.paymentPartnerRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.order', 'order')
        .leftJoinAndSelect('payment.invoicePartner', 'invoicePartner')
        .leftJoinAndSelect('payment.partner', 'partner')
        .leftJoinAndSelect('payment.user', 'user')
        .leftJoinAndSelect('payment.currency', 'currency')
        .leftJoinAndSelect('payment.method', 'method')
        .leftJoinAndSelect('user.profile', 'profile')
        .orderBy('payment.id', 'DESC')
        .skip(offset)
        .take(limit);

      if (kind === ROLE_NAME.SALE_ASSISTANT) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('user.id = :userId', {
              userId: userId,
            });
          }),
        );
      }

      if (keyword) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('invoicePartner.code LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (
        currencyId &&
        (await checkExistInRepo(currencyId, this.currencyRepository))
      ) {
        data.andWhere(
          new Brackets((q) => {
            q.where('currency.id = :currencyId', {
              currencyId: +currencyId,
            });
          }),
        );
      }

      const priceForm = Number(valueFrom?.replace(/[^0-9.-]+/g, ''));
      const priceTo = Number(valueTo?.replace(/[^0-9.-]+/g, ''));

      if (priceForm && !priceTo) {
        querySearch(data, 'payment.amount >= :priceForm', priceForm);
      } else if (!priceForm && priceTo) {
        querySearch(data, 'payment.amount <= :priceTo', priceTo);
      } else if (priceForm && priceTo && priceTo > priceForm) {
        querySearch(data, 'payment.amount <= :priceTo', priceTo);
        querySearch(data, 'payment.amount >= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo < priceForm) {
        querySearch(data, 'payment.amount >= :priceTo', priceTo);
        querySearch(data, 'payment.amount <= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo == priceForm) {
        querySearch(data, 'payment.amount = :priceTo', priceTo);
      }

      if (startTime && !endTime) {
        querySearch(data, 'payment.payment_date >= :startTime', startTime);
      } else if (!startTime && endTime) {
        querySearch(data, 'payment.payment_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime > endTime) {
        querySearch(data, 'payment.payment_date <= :startTime', startTime);
        querySearch(data, 'payment.payment_date >= :endTime', endTime);
      } else if (startTime && endTime && startTime < endTime) {
        querySearch(data, 'payment.payment_date >= :startTime', startTime);
        querySearch(data, 'payment.payment_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime == endTime) {
        querySearch(data, 'payment.payment_date = :startTime', startTime);
      }

      methodId && querySearch(data, 'method.id = :methodId', methodId);

      let [partner, count] = await data.getManyAndCount();

      const response = new PaginationResponseWithTotalData<any>(partner, count);
      return {
        data: response,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findOne(
    id: number,
    pagination: PaginationQuery,
    headers: any,
    req: RequestWithUser,
  ) {
    try {
      const lang = headers.lang;
      const kind = req.user.kind;
      const userId = +req.user.userId;
      let { offset = 0, limit = 0 } = pagination;
      if (id && !(await checkExistInRepo(id, this.paymentPartnerRepository)))
        throw new NotFoundException();

      const partnerPayment = await this.paymentPartnerRepository.findOne({
        where: { id: id },
        relations: {
          order: true,
          partner: true,
          invoicePartner: {
            invoice: true,
          },
          currency: true,
          method: true,
          user: true,
        },
      });

      if (
        kind === ROLE_NAME.SALE_ASSISTANT &&
        Number(userId) !== Number(partnerPayment?.user?.id)
      ) {
        throw new NotFoundException();
      }

      const response = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.PAYMENT_PARTNER,
        offset,
        limit,
      );

      return {
        data: partnerPayment,
        logNotes: transformLogNote(response, lang, this.i18n),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async delete(id: number, headers: any, req: RequestWithUser) {
    try {
      const lang = headers.lang;
      const paymentPartner = await this.paymentPartnerRepository.findOne({
        where: { id: id },
        relations: { invoicePartner: true },
      });

      if (!paymentPartner) {
        throw new NotFoundException();
      }

      await this.paymentPartnerRepository.softDelete(id);
      await this.partnerInvoiceRepository.update(
        paymentPartner?.invoicePartner?.id,
        { status: InvoiceStatusEnum.Created },
      );

      return {
        data: null,
        message: this.i18n.t('message.status_messages.delete_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    body: CreatePaymentPartnerDto,
    header,
    req: RequestWithUser,
  ) {
    try {
      const lang = header.lang;
      const payment = await this.validateEntity(
        id,
        this.paymentPartnerRepository,
        'Payment Partner',
        lang,
        {
          order: true,
          partner: true,
          invoicePartner: {
            invoice: true,
          },
          currency: true,
          method: true,
        },
      );

      if (!payment) {
        throw new NotFoundException();
      }

      const oldInvoice = payment.invoicePartner?.id;

      const { invoicePartnerId, methodId, currencyId, amount } = body;

      if (+invoicePartnerId !== +payment?.invoicePartner?.id) {
        const invoicePartner = await this.validateEntity(
          +invoicePartnerId,
          this.partnerInvoiceRepository,
          'Partner Invoice',
          lang,
          {
            order: true,
            invoice: true,
            customerPartner: {
              partnerCustomer: true,
              partners: true,
              partnerOrder: true,
            },
          },
        );

        if (
          +invoicePartner.status !== InvoiceStatusEnum.Request_Sending &&
          +invoicePartner.status != InvoiceStatusEnum?.Over_Due &&
          +invoicePartner.status != InvoiceStatusEnum?.Created
        ) {
          throw new BadRequestException(
            this.i18n.t(
              'message.status_messages.Can_not_create_payment_for_this_invoice',
              { lang: lang },
            ),
          );
        }

        if (Number(amount) !== Number(invoicePartner?.total_value)) {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.payment_amout_invalid', {
              lang: lang,
            }),
          );
        }

        payment.amount = Number(amount);
        payment.order = +invoicePartner.order.id;
        payment.invoicePartner = +invoicePartnerId;
        payment.partner = +invoicePartner?.customerPartner?.partners?.id;
      }

      await this.validateEntity(
        +currencyId,
        this.currencyRepository,
        'Currency',
        lang,
      );
      await this.validateEntity(
        +methodId,
        this.paymentMethodRepository,
        'Payment Method',
        lang,
      );

      payment.transactionId = body.transaction;
      payment.method = body.methodId;
      payment.paymentDate = body.paymentDate;
      payment.notes = body.notes;
      payment.currency = body.currencyId;

      await this.paymentPartnerRepository.save(payment);
      if (+invoicePartnerId !== +payment?.invoicePartner?.id) {
        await Promise.all([
          this.partnerInvoiceRepository.update(oldInvoice, {
            status: InvoiceStatusEnum.Created,
          }),
          this.partnerInvoiceRepository.update(invoicePartnerId, {
            status: InvoiceStatusEnum.Completed,
          }),
        ]);
      }

      return {
        data: {
          ...payment,
          ...body,
        },
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async createPaymentWithManyInvoice(body: CreatePaymentManyInvoiceDTO, header, req: RequestWithUser, attachment: any) {
    try {
      const lang = header.lang;
      const userId = +req.user.userId;
      const { invoicePartnerIds, methodId, orderId } = body;

      const listInvoiceIds = invoicePartnerIds.split(", ")
      const listInvoice = await this.partnerInvoiceRepository.find({
        where: {
          id: In(listInvoiceIds)
        },
        relations: {
          order: {
            currency: true,
            partners: {
              partners: true
            }
          }
        }
      })

      const resultCheck = listInvoice.length === listInvoiceIds.length;

      const checkInoviceInOrder = await this.checkInoviceInOrder(listInvoice, +orderId)

      if (!resultCheck || !checkInoviceInOrder) {
        throw new NotFoundException();
      }

      const checkStatus =  await this.checkStatus(listInvoice);

      if(!checkStatus) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.Can_not_create_payment_for_this_invoice',
            { lang: lang },
          ),
        );
      }

      await this.validateEntity(
        +methodId,
        this.paymentMethodRepository,
        'Payment Method',
        lang,
      );

      let description: any;
      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = attachment.filter((items: any) =>
          !items.mimetype.startsWith('image/'),
        );
        description = await attendDescription(
          imageAttach,
          fileAttach,
          body.notes,
        )
      }

      const amount = listInvoice.reduce((acc: number, obj: any) => acc + Number(obj.commisson_amount), 0);

      const payload: any = {
        amount: Number(amount),
        transactionId: body.transaction,
        method: body.methodId,
        order: +body.orderId,
        paymentDate: body.paymentDate,
        notes: description ?? body.notes,
        currency: +listInvoice[0]?.order?.currency?.id,
        partner: +listInvoice[0]?.order?.partners[0]?.partners?.id,
        user: userId,
      };

      const paymentPartner = await this.paymentPartnerRepository.save(payload);

      if (attachment && attachment?.length > 0) {
        let LogNoteImage = [];
        attachment.forEach((item: any) => {
          const logNote: any = {
            object: LogNoteObject.PAYMENT_PARTNER,
            objectId: Number(paymentPartner.id),
            action: item?.mimetype.startsWith('image/')
              ? LogNoteActions.UPLOAD_FILE
              : LogNoteActions.UPLOAD_FILE_RAW,
            user: +userId,
            attachment: item?.filename,
          };

          LogNoteImage.push(logNote);
        });

        await this.logNoteRepository.save(LogNoteImage);
      }




      const updateStatus = listInvoice.map(obj => ({ ...obj, status: InvoiceStatusEnum?.Completed, paymentPartnerInvoice: paymentPartner?.id }));

      await this.partnerInvoiceRepository.save(updateStatus);
      return {
        data: payload,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e)
    }
  }

  private checkInoviceInOrder(invoiceList: any, orderId: number) {
    return invoiceList.reduce((result, item) => {
      return result && Number(item.order.id) === orderId;
    }, true);
  }

  private checkStatus(invoice: any) {
    return  invoice.reduce((acc, cur) => {
      if (cur.status === +InvoiceStatusEnum.Completed) {
        return false;
      }
      return acc;
    }, true);
  }

  private async checkInvoice(invoice: string) {
    const invocieId = await this.partnerInvoiceRepository
      .createQueryBuilder('invoice')
      .select('invoice.id')
      .getMany();

    const invoiceFomat = invocieId.map((item) => item.id + '');
    return invoice.split(', ').every((value) => {
      return invoiceFomat.includes(value);
    });
  }
}
