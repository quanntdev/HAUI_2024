import { Customer } from './../../entities/customer.entity';
import { Order } from './../../entities/order.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Currency,
  Invoice,
  LogNote,
  Payment,
  PaymentMethod,
} from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Brackets, Repository } from 'typeorm';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from 'src/common/dtos';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { InvoiceStatusEnum } from '../invoices/enum/invoice-status.enum';
import { getSumPayment } from 'src/common/utils/getSumPayment';
import { querySearch } from 'src/common/utils/querySearch';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { RequestWithUser } from 'src/common/interfaces';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { DataLogNote } from 'src/common/utils/logNotesClass';
import { formatToStringValue } from 'src/common/utils/formatToStringValue';
import * as path from 'path';
const fs = require('fs');
import {
  ATTACHMENT_FORDER,
  DEFAULT_LIMIT_PAGINATE,
  ROLE_NAME,
} from 'src/constants';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    @BodyWithMiddleware() createPaymentDto: CreatePaymentDto,
    attachment: any,
    Headers: any,
  ) {
    const lang = Headers.lang;
    const { methodId, ...restCreatePayments } = createPaymentDto;
    let createPaymentData: any = restCreatePayments;
    try {
      if (restCreatePayments?.amount <= 0) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.PAYMENT AMOUNT INVALID', {
            lang: lang,
          }),
        );
      }
      if (
        !+methodId ||
        !(await checkExistInRepo(+methodId, this.paymentMethodRepository))
      ) {
        throw new NotFoundException(
          this.i18n.t(
            'message.status_messages.Can_not_found_payment_method_ID',
            {
              lang: lang,
            },
          ),
        );
      } else {
        createPaymentData = {
          ...createPaymentData,
          method: +methodId,
          amount: +createPaymentData.amount,
          attachment: attachment,
        };
      }
      return createPaymentData;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  async findAll(
    pagination: PaginationQuery,
    searchPaymentDto: SearchPaymentDto,
    req: RequestWithUser
  ) {
    const { offset = 0, limit = DEFAULT_LIMIT_PAGINATE, keyword } = pagination;
    const {
      orderId,
      customerId,
      currencyId,
      methodId,
      valueFrom,
      valueTo,
      categoryId,
      startTime,
      endTime,
    } = searchPaymentDto;

    try {
      const query = this.createQuerySearch(offset, limit);
      const kind = req.user.kind;
      const userId = req.user.userId
      const querySearchAll = this.createQuerySearch();
      let dataCustomer: any = null;

      if (customerId) {
        dataCustomer = await this.customerRepository.findOne({
          where: {
            id: Number(customerId),
          },
          relations: {
            currency: true,
          },
        });

        if (!dataCustomer) {
          throw new BadRequestException('Customer does not exist');
        }

        query.andWhere(
          new Brackets((q) => {
            q.where('orders.customer_id = :customerId', { customerId });
          }),
        );
        querySearchAll.andWhere(
          new Brackets((q) => {
            q.where('orders.customer_id = :customerId', { customerId });
          }),
        );
        querySearchAll.orWhere(
          new Brackets((q) => {
            q.where('payments.customer_id = :customerId', { customerId });
          }),
        );
        query.orWhere(
          new Brackets((q) => {
            q.where('payments.customer_id = :customerId', { customerId });
          }),
        );
      }

      if(kind === ROLE_NAME.SALE_ASSISTANT) {
        query.andWhere(
          new Brackets((q) => {
            q.where('userAssign.id = :userId', { userId });
          }),
        );
      }

      if (keyword) {
        query
          .andWhere(
            new Brackets((q) => {
              q.where('invoices.code LIKE :keyword', { keyword });
            }),
          )
          .orWhere('customer.name LIKE :keyword', {
            keyword: `%${keyword}%`,
          })
          .orWhere('orders.name LIKE :keyword', {
            keyword: `%${keyword}%`,
          });
      }

      const priceForm = Number(valueFrom?.replace(/[^0-9.-]+/g, ''));
      const priceTo = Number(valueTo?.replace(/[^0-9.-]+/g, ''));

      if (orderId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('invoices.order_id = :orderId', { orderId });
          }),
        );
        querySearchAll.andWhere(
          new Brackets((q) => {
            q.where('invoices.order_id = :orderId', { orderId });
          }),
        );
      }

      if (priceForm && !priceTo) {
        querySearch(query, 'payments.amount >= :priceForm', priceForm);
      } else if (!priceForm && priceTo) {
        querySearch(query, 'payments.amount <= :priceTo', priceTo);
      } else if (priceForm && priceTo && priceTo > priceForm) {
        querySearch(query, 'payments.amount <= :priceTo', priceTo);
        querySearch(query, 'payments.amount >= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo < priceForm) {
        querySearch(query, 'payments.amount >= :priceTo', priceTo);
        querySearch(query, 'payments.amount <= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo == priceForm) {
        querySearch(query, 'payments.amount = :priceTo', priceTo);
      }

      if (startTime && !endTime) {
        querySearch(query, 'payments.payment_date >= :startTime', startTime);
      } else if (!startTime && endTime) {
        querySearch(query, 'payments.payment_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime > endTime) {
        querySearch(query, 'payments.payment_date <= :startTime', startTime);
        querySearch(query, 'payments.payment_date >= :endTime', endTime);
      } else if (startTime && endTime && startTime < endTime) {
        querySearch(query, 'payments.payment_date >= :startTime', startTime);
        querySearch(query, 'payments.payment_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime == endTime) {
        querySearch(query, 'payments.payment_date = :startTime', startTime);
      }

      if (
        currencyId &&
        (await checkExistInRepo(currencyId, this.currencyRepository))
      ) {
        query.andWhere(
          new Brackets((q) => {
            q.where('orders.currency_id = :currencyId', {
              currencyId: +currencyId,
            });
          }),
        );
        querySearchAll.andWhere(
          new Brackets((q) => {
            q.where('orders.currency_id = :currencyId', {
              currencyId: +currencyId,
            });
          }),
        );
        if (customerId) {
          querySearchAll.andWhere(
            new Brackets((q) => {
              q.where('orders.customer_id = :customerId', { customerId });
            }),
          );
        }
      }

      methodId &&
        querySearch(query, 'payments.method_id = :methodId', methodId);

      categoryId &&
        querySearch(query, 'orders.category_id = :categoryId', categoryId);

      const [payments, count] = await query.getManyAndCount();
      const [paymentsTotal] = await querySearchAll.getManyAndCount();
      if (
        currencyId &&
        (await checkExistInRepo(currencyId, this.currencyRepository))
      ) {
        const [todayData, thisMonthData, thisYearData, totalData] =
          this.getDataPayments(paymentsTotal);

        payments.forEach((payment) => this.formatObject(payment));
        return {
          data: new PaginationResponseWithTotalData<any>(
            payments,
            count,
            todayData,
            thisMonthData,
            thisYearData,
            totalData,
          ),
          sumPayment: getSumPayment(
            paymentsTotal,
            dataCustomer?.currency?.sign,
            dataCustomer?.currency?.id,
          ),
        };
      }

      payments.forEach((payment) => this.formatObject(payment));
      return {
        data: new PaginationResponseWithTotalData<any>(payments, count),
        sumPayment: getSumPayment(
          paymentsTotal,
          dataCustomer?.currency?.sign,
          dataCustomer?.currency?.id,
        ),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAllByDate(
    pagination: PaginationQuery,
    searchPaymentDto: SearchPaymentDto,
    req: RequestWithUser
  ) {
    const data =  this.paymentRepository.createQueryBuilder('payment')
      .select('payment.payment_date', 'payment_date')
      .addSelect('SUM(payment.amount)', 'totalAmount')
      .groupBy('payment.payment_date')
      .getRawMany();
    return data
  }

  private createQuerySearch(offset = 0, limit = DEFAULT_LIMIT_PAGINATE) {
    return this.paymentRepository
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.method', 'payment_methods')
      .leftJoinAndSelect('payments.invoice', 'invoices')
      .leftJoinAndSelect('payments.customer', 'customers')
      .leftJoinAndSelect('customers.userAssign', 'userAssign')
      .leftJoinAndSelect('payments.order', 'orders_payment')
      .leftJoinAndSelect('payments.currency', 'currency')
      .leftJoinAndSelect('invoices.order', 'orders')
      .leftJoinAndSelect('orders.customer', 'customer')
      .leftJoinAndSelect('orders.currency', 'curencies')
      .orderBy('payments.id', 'DESC')
      .skip(offset)
      .take(limit);
  }

  private getDataPayments(payments: any) {
    const today = [
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    ].join('-');

    const thisMonth = today?.split('-').slice(0, 2).join('-');
    const thisYear = today?.split('-')[0];
    const todayPayment = payments.filter((payment: any) => {
      return (
        new Date(today).getTime() === new Date(payment?.paymentDate).getTime()
      );
    });

    const thisMonthPayment = payments.filter((payment: any) => {
      return (
        new Date(thisMonth).getTime() ===
        new Date(
          payment?.paymentDate?.split('-').slice(0, 2).join('-'),
        ).getTime()
      );
    });

    const thisYearPayment = payments.filter((payment: any) => {
      return (
        new Date(thisYear).getTime() ===
        new Date(payment?.paymentDate?.split('-')[0]).getTime()
      );
    });

    return [
      {
        count: todayPayment.length,
        totalAmount: todayPayment.reduce((acc: any, curr: any) => {
          return acc + Number(curr.amount);
        }, 0),
      },
      {
        count: thisMonthPayment.length,
        totalAmount: thisMonthPayment.reduce((acc: any, curr: any) => {
          return acc + Number(curr.amount);
        }, 0),
      },
      {
        count: thisYearPayment.length,
        totalAmount: thisYearPayment.reduce((acc: any, curr: any) => {
          return acc + Number(curr.amount);
        }, 0),
      },
      {
        count: payments.length,
        totalAmount: payments.reduce((acc: any, curr: any) => {
          return acc + Number(curr.amount);
        }, 0),
      },
    ];
  }

  async findOne(id: number, pagination: PaginationQuery, Headers: any, req: RequestWithUser) {
    const lang = Headers.lang;
    const kind = req.user.kind;
    const userId = Number(req.user.userId)
    let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: {
          method: true,
          customer: {
            currency: true,
            userAssign: true,
          },
          order: true,
          currency: true,
          invoice: {
            order: {
              customer: {
                currency: true,
              },
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.Can_not_found_payment', {
            lang: lang,
          }),
        );
      }

      if(kind === ROLE_NAME.SALE_ASSISTANT && userId !== Number(payment?.customer?.userAssign?.id)) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.Can_not_found_payment', {
            lang: lang,
          }),
        );
      }
      const response = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.PAYMENT,
        offset,
        limit,
      );

      return {
        data: this.formatObject({
          ...payment,
          logNotes: transformLogNote(response,lang, this.i18n),
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
    req: RequestWithUser,
    attachment: Express.Multer.File,
    Headers: any,
  ) {
    const lang = Headers.lang;
    const userId = Number(req.user.userId);
    const {
      methodId,
      invoiceId,
      orderId,
      customerId,
      currencyId,
      ...restData
    } = updatePaymentDto;
    try {
      if (Number(restData.amount) <= 0)
        throw new BadRequestException(
          this.i18n.t('message.status_messages.payment_amount_invalid', {
            lang: lang,
          }),
        );

      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: {
          invoice: { order: { customer: true } },
          method: true,
          customer: {
            currency: true,
          },
          order: true,
        },
      });

      if (!payment)
        throw new NotFoundException(
          this.i18n.t('message.status_messages.can_not_found_this_name', {
            lang: lang,
            args: { name: 'payment' },
          }),
        );

      let updatePaymentData: any = {
        ...restData,
        amount: +restData.amount,
      };

      let customerItem: any = null;

      if (customerId) {
        customerItem = await this.customerRepository.findOne({
          where: { id: +customerId },
        });
        
        if (!customerItem) {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.can_not_found_this_name', {
              lang: lang,
              args: { name: 'customer' },
            }),
          );
        }
        updatePaymentData.customer = +customerItem.id;
        updatePaymentData.order = null;
      }

      if (attachment && payment.attachment !== null) {
        const filePath = path.join(`${ATTACHMENT_FORDER}/`, payment.attachment);
        await fs.unlink(filePath, (err: any) => console.log(err));
      }

      //check invoice
      let invoiceItem: any = null;
      if (invoiceId) {
        invoiceItem = await this.invoiceRepository.findOne({
          where: { id: Number(invoiceId) },
        });

        if (!invoiceItem)
          throw new NotFoundException(
            this.i18n.t('message.status_messages.can_not_found_this_name', {
              lang: lang,
              args: { name: 'invoice' },
            }),
          );
      } else {
        updatePaymentData.invoice = null;
      }

      //check order
      let orderItem: any = null;
      if (orderId) {
        orderItem = await this.orderRepository.findOne({
          where: { id: Number(orderId) },
        });
        if (!orderItem)
          throw new NotFoundException(
            this.i18n.t('message.status_messages.can_not_found_this_name', {
              lang: lang,
              args: { name: 'order' },
            }),
          );
        updatePaymentData.order = +orderItem.id;
      } else {
        updatePaymentData.order = null;
      }

      let currencyItem: any = null;
      if (currencyId) {
        currencyItem = await this.currencyRepository.findOne({
          where: { id: Number(currencyId) },
        });
        if (!currencyItem)
          throw new NotFoundException(
            this.i18n.t('message.status_messages.can_not_found_this_name', {
              lang: lang,
              args: { name: 'currency' },
            }),
          );
        updatePaymentData.currency = +currencyItem.id;
      }

      if (attachment) {
        updatePaymentData.attachment = attachment;
      }
      let invoiceBalanceDue = Number(payment?.invoice?.balanceDue);
      let invoiceStatus = Number(payment?.invoice?.status);
      let invoiceDuedate = new Date(payment?.invoice?.due_date).getTime();
      let invoiceTotalValue = Number(payment?.invoice?.total_value);
      let beforeUpdatePaymentAmount = Number(payment?.amount);
      if (
        +methodId &&
        (await checkExistInRepo(+methodId, this.paymentMethodRepository))
      ) {
        updatePaymentData = {
          ...updatePaymentData,
          method: +methodId,
        };
      } else {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.invalid_payment_method', {
            lang: lang,
          }),
        );
      }

      if (
        !invoiceId ||
        (payment?.invoice?.id && +invoiceId == +payment?.invoice.id)
      ) {
        if (updatePaymentData.amount === beforeUpdatePaymentAmount) {
          await this.paymentRepository.update(id, {
            ...payment,
            ...updatePaymentData,
          });

          const updatedPayment = await this.paymentRepository.findOne({
            where: { id },
            relations: {
              invoice: { order: { customer: true } },
              method: true,
            },
          });

          if (!!updatedPayment) {
            await this.createInvoiceLogNotes(
              payment,
              updatedPayment,
              +userId,
              id,
            );
          }

          return {
            data: this.formatObject(updatedPayment),
            message: this.i18n.t('message.status_messages.update_success', {
              lang: lang,
            }),
          };
        }

        await this.paymentRepository.update(id, {
          ...payment,
          ...updatePaymentData,
        });

        const updatedPayment = await this.paymentRepository.findOne({
          where: { id },
          relations: {
            invoice: { order: { customer: true } },
            method: true,
          },
        });

        if (!!updatedPayment) {
          await this.createInvoiceLogNotes(
            payment,
            updatedPayment,
            +userId,
            id,
          );
        }
        return {
          data: this.formatObject(updatedPayment),
          message: this.i18n.t('message.status_messages.update_success', {
            lang: lang,
          }),
        };
      }

      let newInvoiceBalanceDue = Number(invoiceItem?.balanceDue);
      let newInvoiceStatus = Number(invoiceItem?.status);

      if (
        !invoiceItem ||
        newInvoiceStatus === InvoiceStatusEnum.Completed ||
        newInvoiceStatus === InvoiceStatusEnum.Over_Due
      ) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.invalid_selected_new_invoice', {
            lang: lang,
          }),
        );
      }

      invoiceBalanceDue += beforeUpdatePaymentAmount;
      if (invoiceBalanceDue === invoiceTotalValue) {
        invoiceStatus =
          invoiceDuedate <= Date.now()
            ? InvoiceStatusEnum.Over_Due
            : InvoiceStatusEnum.Request_Sending;
      } else {
        invoiceStatus = InvoiceStatusEnum.Paid;
      }

      newInvoiceBalanceDue -= updatePaymentData.amount;
      newInvoiceStatus =
        newInvoiceBalanceDue <= 0
          ? InvoiceStatusEnum.Completed
          : InvoiceStatusEnum.Paid;
      if (payment?.invoice?.id) {
        await this.invoiceRepository.update(payment?.invoice?.id, {
          balanceDue: invoiceBalanceDue,
          status: invoiceStatus,
        });
      }
      await this.invoiceRepository.update(+invoiceId, {
        balanceDue: newInvoiceBalanceDue,
        status: newInvoiceStatus,
      });
      await this.paymentRepository.update(id, {
        ...payment,
        ...updatePaymentData,
        invoice: +invoiceId,
      });

      const newPayment = await this.paymentRepository.findOne({
        where: { id },
        relations: {
          invoice: { order: { customer: true } },
          method: true,
        },
      });

      if (!!newPayment) {
        await this.createInvoiceLogNotes(payment, newPayment, +userId, id);
      }

      return {
        data: this.formatObject(newPayment),
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async remove(id: number, Headers: any) {
    const lang = Headers.lang;
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: {
        invoice: true,
      },
    });
    if (!payment) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', {
          lang: lang,
        }),
      );
    } else {
      if (payment?.invoice) {
        const invoiceItem = await this.invoiceRepository.findOne({
          where: { id: Number(payment?.invoice?.id) },
          relations: {
            payment: true,
          },
        });
        if (invoiceItem) {
          invoiceItem.balanceDue =
            Number(invoiceItem?.balanceDue) + Number(payment?.amount);
          await this.invoiceRepository.save(invoiceItem);
          if (invoiceItem.status === InvoiceStatusEnum.Completed) {
            invoiceItem.status = InvoiceStatusEnum.Paid;
            await this.invoiceRepository.save(invoiceItem);
          }
          if (
            invoiceItem.status === InvoiceStatusEnum.Paid &&
            Number(invoiceItem.balanceDue) === Number(invoiceItem.total_value)
          ) {
            invoiceItem.status = InvoiceStatusEnum.Created;
            await this.invoiceRepository.save(invoiceItem);
          }
          await this.paymentRepository.softDelete(id);
        }
      } else {
        await this.paymentRepository.softDelete(id);
      }
    }

    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }

  async createInvoiceLogNotes(
    before: any,
    after: any,
    userId: number,
    objectId: number,
  ) {
    const compareList = ['amount', 'paymentDate', 'method', 'invoice', 'notes'];
    compareList.forEach(async (item: string) => {
      if (JSON.stringify(before[item]) != JSON.stringify(after[item])) {
        let action: number;
        switch (item) {
          case 'method':
            action = LogNoteActions.CHANGE_METHOD;
            break;
          case 'invoice':
            if (
              JSON.stringify(before[item]?.code) !=
              JSON.stringify(after[item]?.code)
            ) {
              action = LogNoteActions.CHANGE_INVOCE;
              break;
            }
            return;
          case 'amount':
            action = LogNoteActions.CHANGE_AMOUNT;
            break;
          case 'paymentDate':
            action = LogNoteActions.CHANGE_DATE;
            break;
          case 'notes':
            action = LogNoteActions.CHANGE_DESCRIPTION;
            break;
          default:
            return;
        }
        if (action === LogNoteActions.CHANGE_METHOD) {
          const dataValue = {
            oldValue: JSON.stringify(before[item]?.name),
            newValue: JSON.stringify(after[item]?.name),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.PAYMENT,
            objectId,
            action,
            dataValue,
          );
          await this.logNoteRepository.save(logNote);
        } else if (action === LogNoteActions.CHANGE_INVOCE) {
          const dataValue = {
            oldValue: JSON.stringify(before[item]?.code),
            newValue: JSON.stringify(after[item]?.code),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.PAYMENT,
            objectId,
            action,
            dataValue,
          );
          await this.logNoteRepository.save(logNote);
        } else if (action === LogNoteActions.CHANGE_DESCRIPTION) {
          const dataValue = {
            oldValue: JSON.stringify(before[item]),
            newValue: JSON.stringify(after[item]),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.PAYMENT,
            objectId,
            action,
            dataValue,
          );
          await this.logNoteRepository.save(logNote);
        } else {
          const oldValue =
            action === LogNoteActions.CHANGE_AMOUNT
              ? formatToStringValue(before[item]) +
                before?.invoice?.currency_sign
              : before[item];
          const newValue =
            action === LogNoteActions.CHANGE_AMOUNT
              ? formatToStringValue(after[item]) +
                before?.invoice?.currency_sign
              : after[item];
          const dataValue = {
            oldValue: JSON.stringify(oldValue),
            newValue: JSON.stringify(newValue),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.PAYMENT,
            objectId,
            action,
            dataValue,
          );
          await this.logNoteRepository.save(logNote);
        }
      }
    });
  }

  private formatObject(Obj: any) {
    if (Obj.invoice?.order) {
      Obj.order = Obj?.invoice.order;
      delete Obj?.invoice['order'];
      if (Obj.order?.customer) {
        Obj.customer = Obj?.order?.customer;
        delete Obj.order.customer;
      }
      return Obj;
    }
    return Obj;
  }
}
