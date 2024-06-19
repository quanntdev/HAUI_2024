import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from 'src/common/dtos';
import { RequestWithUser } from 'src/common/interfaces';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import {
  DEFAULT_LIMIT_PAGINATE,
  INVOICE_CODE_MAX_LENGTH,
  INVOICE_PARTNERC_CODE,
  MIN_CHARACTER,
} from 'src/constants';
import { Currency, LogNote, Order, PartnerInvoice } from 'src/entities';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Brackets, In, Repository } from 'typeorm';
import {
  UpdateInvoiceNameDto,
  UpdateInvoiceStatusDto,
} from '../invoices/dto/update-invoice.dto';
import { InvoiceStatusEnum } from '../invoices/enum/invoice-status.enum';
import config from '../../config';
import { SearchInvoiceDto } from '../invoices/dto/search-invoice.dto';
import { querySearch } from 'src/common/utils/querySearch';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { DataLogNote } from 'src/common/utils/logNotesClass';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
import { UpdateInvoicePartnerDto } from './dto/updateInvoicePartner.dto';
import { formatToStringValue } from 'src/common/utils/formatToStringValue';

@Injectable()
export class PartnerInvoicesService {
  constructor(
    @InjectRepository(PartnerInvoice)
    private readonly invoicePartnerRepository: Repository<PartnerInvoice>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,


    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(request: any,  userId:number , createInvoiceDto: CreateInvoiceDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: Number(request?.order),
        },
        relations: {
          billingType: true,
          customer: {
            country: true,
          },
          partners: {
            partnerOrder: true,
            partners: true,
            partnerCustomer: {
              currency: true,
            },
          },
        },
      });

      if (order?.partners?.length > 0) {
       const data =  await this.createPayload(request, order, createInvoiceDto);

       const newLog: any = {
        object: LogNoteObject.INVOICE_PARTNER,
        objectId: Number(data.id),
        action: LogNoteActions.CREATE,
        user: +userId,
      };
       await this.logNoteRepository.save(newLog);
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async createPayload(request: any, order: any, createInvoiceDto: CreateInvoiceDto) {
    let invoicePartnerPayload: any = {};
    const total_value = (Number(request?.total_value) * Number(order.partners[0].salePercent)) /
    100;
    const VAT = createInvoiceDto?.VAT ?  Number(createInvoiceDto?.VAT) : 0
    invoicePartnerPayload = {
      code: await this.generateCodeInvoice(order),
      partnerName: order?.partners[0]?.partners?.name,
      currency_sign: order.partners[0].partnerCustomer.currency.sign,
      currency_name: order.partners[0].partnerCustomer.currency.name,
      salePercent: order.partners[0].salePercent,
      start_date: request?.start_date,
      due_date: request?.due_date,
      total_value:total_value,
      order: Number(order?.id),
      invoice: Number(request?.id),
      customerPartner: Number(order.partners[0]?.id),
      status: Number(request?.status),
      VAT: VAT,
      commisson_amount: total_value * (100 + VAT) / 100,
    };

    const data =  await this.invoicePartnerRepository.save(invoicePartnerPayload);
    return data
  }

  private async generateCodeInvoice(orderDB: Order): Promise<string> {
    const bullingTypeName = INVOICE_PARTNERC_CODE;

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const numericOrderInvoice = await this.generateNumericOrderInvoice();
    return `${
      bullingTypeName
    }-${currentDate}${numericOrderInvoice}`;
  }

  private async generateNumericOrderInvoice(): Promise<string> {
    const currentDate = new Date();
    let nextInvoiceNumber = 0;
    const invoices = await this.invoicePartnerRepository
      .createQueryBuilder('PartnerInvoice')
      .where(
        "DATE_FORMAT(PartnerInvoice.created_at, '%Y-%m-%d') = :currentDate",
        {
          currentDate: currentDate.toISOString().split('T')[0],
        },
      )
      .getMany();

    const newData = invoices?.map((e: any) => {
      return (e?.code).split('-').pop().slice(MIN_CHARACTER);
    });

    if (invoices.length === 0) {
      nextInvoiceNumber = 1;
    } else {
      nextInvoiceNumber = Math.max(...newData) + 1;
    }

    return String(Number(nextInvoiceNumber)).padStart(
      INVOICE_CODE_MAX_LENGTH,
      '0',
    );
  }

  async tranformCode(code: string) {
    return code.split('-').pop();
  }

  async findOne(id: number, pagination: PaginationQuery, headers: any) {
    try {
      const lang = headers.lang;
      if (id && !(await checkExistInRepo(id, this.invoicePartnerRepository)))
        throw new NotFoundException();

      const partnerInvoice = await this.invoicePartnerRepository.findOne({
        where: { id: id },
        relations: {
          order: true,
          invoice: true,
          customerPartner: {
            partnerCustomer: {
              currency: true,
            },
            partners: true,
            partnerOrder: true,
          },
        },
      });

      const response = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.INVOICE_PARTNER,
        pagination.offset,
        pagination.limit,
      );

      return {
        data: partnerInvoice,
        logNote: transformLogNote(response, lang, this.i18n)
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAll(pagination: any, req: RequestWithUser, searchInvoiceDto: SearchInvoiceDto) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
      } = pagination;

      const {
        statusId,
        currencyId,
        valueFrom,
        valueTo,
        startTime,
        endTime,
        keyword,
      } = searchInvoiceDto;


      const priceForm = Number(valueFrom?.replace(/[^0-9.-]+/g, ''));
      const priceTo = Number(valueTo?.replace(/[^0-9.-]+/g, ''));

      const data = this.invoicePartnerRepository
        .createQueryBuilder('partnerInvoice')
        .leftJoinAndSelect('partnerInvoice.order', 'order')
        .leftJoinAndSelect('partnerInvoice.invoice', 'invoice')
        .leftJoinAndSelect('partnerInvoice.customerPartner', 'customerPartner')
        .leftJoinAndSelect('customerPartner.partnerCustomer', 'partnerCustomer')
        .leftJoinAndSelect('customerPartner.partners', 'partners')
        .leftJoinAndSelect('customerPartner.partnerOrder', 'partnerOrder')
        .orderBy('partnerInvoice.id', 'DESC')
        .skip(offset)
        .take(limit);

      if (keyword) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('partnerInvoice.code LIKE :keyword', {
              keyword: `%${keyword}%`,
            }).orWhere('partnerInvoice.partnerName LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (statusId) {
        data.andWhere(
          new Brackets((q) => {
            q.where('partnerInvoice.status = :statusId', { statusId: +statusId });
          }),
        );
      }

      if (currencyId) {
        const currency = await this.currencyRepository.findOne({
          where: { id: currencyId },
        });

        data.andWhere(
          new Brackets((q) => {
            q.where('partnerInvoice.currency_name = :currency_name', {
              currency_name: currency?.name,
            });
          }),
        );
      }

      if (priceForm && !priceTo) {
        querySearch(data, 'partnerInvoice.total_value >= :priceForm', priceForm);
      } else if (!priceForm && priceTo) {
        querySearch(data, 'partnerInvoice.total_value <= :priceTo', priceTo);
      } else if (priceForm && priceTo && priceTo > priceForm) {
        querySearch(data, 'partnerInvoice.total_value <= :priceTo', priceTo);
        querySearch(data, 'partnerInvoice.total_value >= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo < priceForm) {
        querySearch(data, 'partnerInvoice.total_value >= :priceTo', priceTo);
        querySearch(data, 'partnerInvoice.total_value <= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo == priceForm) {
        querySearch(data, 'partnerInvoice.total_value = :priceTo', priceTo);
      }

      if (startTime && !endTime) {
        querySearch(data, 'partnerInvoice.start_date >= :startTime', startTime);
      } else if (!startTime && endTime) {
        querySearch(data, 'partnerInvoice.start_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime > endTime) {
        querySearch(data, 'partnerInvoice.start_date <= :startTime', startTime);
        querySearch(data, 'partnerInvoice.start_date >= :endTime', endTime);
      } else if (startTime && endTime && startTime < endTime) {
        querySearch(data, 'partnerInvoice.start_date >= :startTime', startTime);
        querySearch(data, 'partnerInvoice.start_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime == endTime) {
        querySearch(data, 'partnerInvoice.start_date = :startTime', startTime);
      }


      let [partner, count] = await data.getManyAndCount();
      partner = partner.map((item) => {
        return {
          ...item,
          statusName: this.getInvoiceStatusName(item.status),
        };
      });

      const response = new PaginationResponseWithTotalData<any>(partner, count);
      return {
        data: response,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  private getInvoiceStatusName(status: number): string {
    return InvoiceStatusEnum[status].replace(/_/g, ' ');
  }

  async updateName(
    id: number,
    updateInvoiceName: UpdateInvoiceNameDto,
    userId: number,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      const invoice = await this.invoicePartnerRepository.findOne({
        where: { id },
      });

      const defautlName = invoice.code;

      if (!invoice) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.Can_not_found_invoice_by_invoice_ID',
            {
              lang: lang,
            },
          ),
        );
      }

      const findInvoiceName = await this.invoicePartnerRepository.findOne({
        where: {
          code: updateInvoiceName?.code,
        },
      });
      if (findInvoiceName) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.this_InvoiceID_has_found', {
            lang: lang,
          }),
        );
      }

      if (invoice && invoice?.status != InvoiceStatusEnum.Created) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.You_can_not_update_this_InvoiceCode',
            {
              lang: lang,
            },
          ),
        );
      }

      invoice.code = updateInvoiceName.code;

      await this.invoicePartnerRepository.update(id, {
        ...invoice,
      });

      const value = {
        oldValue: JSON.stringify(defautlName),
        newValue: JSON.stringify(updateInvoiceName.code),
      };

      const logNoteInvoice = new DataLogNote(
        +userId,
        LogNoteObject.INVOICE_PARTNER,
        Number(id),
        LogNoteActions.CHANGE_NAME,
        value,
      );
      this.logNoteRepository.save(logNoteInvoice);
      return {
        data: invoice,
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'updateStatusInvoicePartner',
    timeZone: config.TIME_ZONE ?? 'Asia/Ho_Chi_Minh',
  })
  async updateStatusInvoiceCronJob(handlebyRequest: boolean) {
    const invoices = await this.invoicePartnerRepository.find({
      where: {
        status: InvoiceStatusEnum.Created,
      },
    });
    const overDueInvoiceIds = invoices
      .filter(
        (invoice) =>
          invoice.due_date && new Date(invoice.due_date).getTime() < Date.now(),
      )
      .map((invoice) => +invoice.id);
    if (overDueInvoiceIds.length > 0) {
      await this.invoicePartnerRepository.update(
        { id: In(overDueInvoiceIds) },
        { status: InvoiceStatusEnum.Over_Due },
      );
    }
    if (handlebyRequest) {
      return { data: [] };
    }
  }

  async updateStatus(
    id: number,
    req: RequestWithUser,
    updateInvoiceStatusDto: UpdateInvoiceStatusDto,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      const status = +updateInvoiceStatusDto.status;
      if (
        status != InvoiceStatusEnum.Created &&
        status != InvoiceStatusEnum.Request_Sending
      ) {
        throw new BadRequestException();
      }
      const invoice = await this.invoicePartnerRepository.findOne({
        where: { id },
      });

      if (
        invoice.status === InvoiceStatusEnum.Paid ||
        invoice.status === InvoiceStatusEnum.Completed
      ) {
        throw new BadRequestException();
      }

      await this.invoicePartnerRepository.update(id, { status });
      return {
        data: {
          ...invoice,
          status,
        },
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  async getInvoicePartnerOfOrder(id: number, header: any, pagination: any) {
    try {
      const invoice = this.invoicePartnerRepository
        .createQueryBuilder('invoice')
        .where('invoice.order.id = :id', { id: id })
        .andWhere('invoice.status IN (:statuses)', {
          statuses: [
            InvoiceStatusEnum.Request_Sending,
            InvoiceStatusEnum.Over_Due,
            InvoiceStatusEnum.Created,
          ],
        });

      if (pagination?.keyId) {
        invoice.orWhere(
          new Brackets((qr) => {
            qr.where('invoice.id = :keyId', {
              keyId: pagination.keyId,
            });
          }),
        );
      }

      const data = await invoice.getMany();

      return {
        data: data,
      };
    } catch (err) {
      checkMysqlError(err);
    }
  }

  async update(
    id: number,
    body : UpdateInvoicePartnerDto,
    userId: number,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      const invoice = await this.invoicePartnerRepository.findOne({
        where: { id },
      });

      const invoiceDefault = {...invoice}

      if (!invoice) {
        throw new NotFoundException(
          this.i18n.t(
            'message.status_messages.Can_not_found_invoice_by_invoice_ID',
            {
              lang: lang,
            },
          ),
        );
      }

      if (invoice && invoice?.status != InvoiceStatusEnum.Created) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.You_can_not_update_this_InvoiceCode',
            {
              lang: lang,
            },
          ),
        );
      }

      const VAT = body.VAT ? Number(body.VAT) : 0


      invoice.start_date = body.startDate;
      invoice.due_date = body.dueDate;
      invoice.VAT = VAT;
      invoice.commisson_amount = Number(invoice.total_value *(100 + VAT)/100)
      const dataUpdate = await this.invoicePartnerRepository.save(invoice);

      const data = {
        oldValue: invoiceDefault,
        newValue: dataUpdate,
      };

      await this.createInvoiceLogNotes(data, +userId, id);
      return {
        data: invoice,
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };

    } catch (e) {
      checkMysqlError(e);
    }
  }

  async createInvoiceLogNotes(data: any, userId: number, objectId: number) {
    const compareList = [
      'start_date',
      'due_date',
      'VAT',
    ];
    let oldValue: any;
    let newValue: any;

    compareList.forEach(async (item: string) => {
      let action: number;
      switch (item) {
        case 'start_date':
          oldValue = JSON.stringify(data?.oldValue[item]);
          newValue = JSON.stringify(data?.newValue[item]);
          action = LogNoteActions.CHANGE_START_DATE;
          break;
        case 'due_date':
          oldValue = JSON.stringify(data?.oldValue[item]);
          newValue = JSON.stringify(data?.newValue[item]);
          action = LogNoteActions.CHANGE_DUE_DATE;
          break;
        case 'VAT':
          oldValue = JSON.stringify(formatToStringValue(data?.oldValue[item]));
          newValue = JSON.stringify(formatToStringValue(data?.newValue[item]));
          action = LogNoteActions.CHANGE_VAT;
          break;
        default:
          oldValue = JSON.stringify(data?.oldValue[item]);
          newValue = JSON.stringify(data?.newValue[item]);
      }

      if (data?.oldValue[item] !== data?.newValue[item]) {
        const value = {
          oldValue: oldValue ?? '',
          newValue: newValue ?? '',
        };

        const logNoteInvoice = new DataLogNote(
          +userId,
          LogNoteObject.INVOICE_PARTNER,
          Number(objectId),
          action,
          value,
        );
        this.logNoteRepository.save(logNoteInvoice);
      }
    });
  }
}
