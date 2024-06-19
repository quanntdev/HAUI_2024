import { Currency } from './../../entities/currency.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  UpdateInvoiceDto,
  UpdateInvoiceNameDto,
  UpdateInvoiceStatusDto,
} from './dto/update-invoice.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { Brackets, Repository, Not, Any } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { InvoiceCategory } from '../../entities/invoice-category.entity';
import { InvoiceOrderItem } from '../../entities/invoice-order-item.entity';
import { IInvoice } from './interfaces/invoice.interface';
import {
  IInvoiceOrderItem,
  IInvoiceOrderItemUpdate,
} from '../invoice-order-items/interfaces/invoice-order-item.interface';
import { InvoiceStatusEnum } from './enum/invoice-status.enum';
import { Order } from '../../entities/order.entity';
import {
  DEFAULT_LIMIT_PAGINATE,
  INVOICE_CODE_MAX_LENGTH,
  MIN_CHARACTER,
  ROLE_NAME,
} from 'src/constants';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from '../../common/dtos/pagination';
import { SearchInvoiceDto } from './dto/search-invoice.dto';
import { LogNote, Payment, Customer } from 'src/entities';
import { City } from '../../entities/city.entity';
import { Country } from '../../entities/country.entity';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { querySearch } from 'src/common/utils/querySearch';
import { getSumInvoice } from 'src/common/utils/getSumInvoiceAmount';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { DataLogNote } from 'src/common/utils/logNotesClass';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { RequestWithUser } from 'src/common/interfaces';
import { formatToStringValue } from 'src/common/utils/formatToStringValue';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { attendDescription } from 'src/common/utils/attendDes';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import { PartnerInvoicesService } from '../partner-invoices/partner-invoices.service';
import { StripeService } from '../stripe/stripe.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(InvoiceOrderItem)
    private readonly invoiceOrderItemRepository: Repository<InvoiceOrderItem>,

    @InjectRepository(InvoiceCategory)
    private readonly invoiceCategoryRepository: Repository<InvoiceCategory>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    private i18n: I18nService<I18nTranslations>,
    private readonly partnerInvoiceService: PartnerInvoicesService,
    private readonly stripeService: StripeService,
    private mailerService: MailService,
  ) {}
  async create(
    createInvoiceDto: CreateInvoiceDto,
    userId: number,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      let { order_id, invoice_category_id, order_items, ...restData } =
        createInvoiceDto;
      let invoice: IInvoice | any = {};

      const [orderDB, invoiceCategoryDB] = await Promise.all([
        this.orderRepository.findOne({
          where: { id: order_id },
          relations: {
            customer: { country: true, city: true, currency: true },
            billingType: true,
            items: true,
            currency: true,
          },
        }),
        this.invoiceCategoryRepository.findOne({
          where: { id: invoice_category_id },
        }),
      ]);

      if (orderDB?.customer?.currency === null) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.CAN_NOT_CREATE_ORDER_ITEM_WITHOUT_CURRENCY',
            {
              lang: lang,
            },
          ),
        );
      }

      const invalidOrder = !!orderDB?.customer?.cidCode;

      if (
        !orderDB ||
        !invoiceCategoryDB ||
        !invalidOrder ||
        !this.checkOrderItemInOrder(orderDB.items, order_items)
      ) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.INVALID_CUSTOMER_DATA', {
            lang: lang,
          }),
        );
      }

      invoice = {
        ...restData,
        customer_name: orderDB.customer?.name,
        country_name: orderDB.customer?.country?.name,
        country: orderDB.customer?.country?.id,
        province_name: orderDB.customer?.city?.name,
        city: orderDB.customer?.city?.id,
        postal_code: orderDB.customer?.postalCode,
        address: orderDB.customer?.address,
        currency_name: orderDB.currency?.name,
        currency_sign: orderDB.currency?.sign,
        code: await this.generateCodeInvoice(orderDB),
        total_item: order_items.length,
        total_original_value:
          this.getTotalValueOriginOffAllOrderItem(order_items),
        total_tax_value: this.getTotalTaxRateOfAllOrderItem(order_items),
        total_value: this.getTotalValueOffAllOrderItem(order_items),
        balanceDue: this.getTotalValueOffAllOrderItem(order_items),
        user: userId,
        status: InvoiceStatusEnum.Created,
        order: orderDB.id,
        invoiceCategory: invoiceCategoryDB.id,
        invoiceOrderItems: await this.formatAndCreateInvoiceOrderItems(
          order_items,
        ),
      };

      const invoiceResult = await this.invoiceRepository.save(invoice);

      if (invoiceResult) {
        const data = {
          oldValue: null,
          newValue: JSON.stringify(invoiceResult?.code),
        };
        const logNoteInvoice = new DataLogNote(
          +userId,
          LogNoteObject.INVOICE,
          Number(invoiceResult?.id),
          LogNoteActions.CREATE,
          data,
        );
        this.logNoteRepository.save(logNoteInvoice);
        const logNoteOrder = new DataLogNote(
          +userId,
          LogNoteObject.ORDER,
          Number(order_id),
          LogNoteActions.CREATE_INVOICE,
          data,
        );
        this.logNoteRepository.save(logNoteOrder);
      }

      if (orderDB.customer?.name) {
        const dataChange = {
          oldValue: null,
          newValue: JSON.stringify(invoiceResult?.code),
        };
        const customer = await this.customerRepository.findOne({
          where: {
            name: orderDB.customer?.name,
          },
        });
        const logNoteCustomer = new DataLogNote(
          +userId,
          LogNoteObject.CUSTOMER,
          Number(customer?.id),
          LogNoteActions.CREATE_INVOICE,
          dataChange,
        );
        this.logNoteRepository.save(logNoteCustomer);
      }

      await this.partnerInvoiceService.create(invoiceResult,  +userId, createInvoiceDto)
      console.log(parseFloat(invoiceResult.balanceDue.toFixed(2)) * 100)
      const dataSetup = await this.stripeService.createSetupIntent(parseFloat((invoiceResult?.currency_name == "USD" ? invoiceResult.balanceDue * 100 : invoiceResult.balanceDue).toFixed(2)), invoiceResult?.currency_name?.toLowerCase(), invoiceResult.code)
      if(orderDB?.customer?.email) {
         this.mailerService.invoiceSendMailer(
          orderDB?.customer?.email,
          orderDB?.customer?.name,
          dataSetup?.client_secret,
          invoiceResult?.id
        )
      }
      return {
        data: dataSetup,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      console.log(e)
      if (e instanceof BadRequestException) {
        throw e;
      }

      if (e instanceof NotFoundException) {
        throw e;
      }

      checkMysqlError(e);
    }
  }

  async findAll(
    pagination: PaginationQuery,
    searchInvoiceDto: SearchInvoiceDto,
    Headers: any,
    req: RequestWithUser
  ) {
    try {
      const lang = Headers.lang;
      const kind = req.user.kind;
      const userId = req.user.userId
      const { offset = 0, limit = null } = pagination;
      const {
        statusId,
        orderId,
        customerId,
        currencyId,
        valueFrom,
        valueTo,
        categoryId,
        startTime,
        endTime,
        keyword,
        notInStatus,
      } = searchInvoiceDto;

      const query = this.invoiceRepository
        .createQueryBuilder('invoices')
        .leftJoinAndSelect('invoices.order', 'orders')
        .leftJoinAndSelect('invoices.user', 'users')
        .leftJoinAndSelect('invoices.payment', 'payment')
        .leftJoinAndSelect('payment.method', 'payment_methods')
        .leftJoinAndSelect('orders.customer', 'customers')
        .leftJoinAndSelect('orders.currency', 'currencies')
        .orderBy('invoices.id', 'DESC')
        .skip(offset)
        .take(limit);

      const priceForm = Number(valueFrom?.replace(/[^0-9.-]+/g, ''));
      const priceTo = Number(valueTo?.replace(/[^0-9.-]+/g, ''));

      if(kind === ROLE_NAME.SALE_ASSISTANT) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('users.id = :userId', {
              userId: userId,
            });
          }),
        );
      }

      if (orderId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('invoices.order_id = :orderId', { orderId: +orderId });
          }),
        );
      }

      if (statusId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('invoices.status = :statusId', { statusId: +statusId });
          }),
        );
      }

      if (notInStatus) {
        query.andWhere(
          new Brackets((q) => {
            q.where('invoices.status != :notInStatus', {
              notInStatus: +notInStatus,
            });
          }),
        );
      }

      let customerData: any = null;

      if (customerId) {
        customerData = await this.customerRepository.findOne({
          where: {
            id: Number(customerId),
          },
          relations: {
            currency: true,
          },
        });

        if (!customerData)
          throw new BadRequestException(
            this.i18n.t('message.status_messages.Customer_does_not_exist', {
              lang: lang,
            }),
          );

        query.andWhere({
          order: {
            customer: {
              id: Number(customerId),
            },
          },
        });
      }

      if (categoryId) {
        query.andWhere({
          order: {
            category: {
              id: categoryId,
            },
          },
        });
      }

      if (currencyId) {
        const currency = await this.currencyRepository.findOne({
          where: { id: currencyId },
        });

        query.andWhere(
          new Brackets((q) => {
            q.where('invoices.currency_name = :currency_name', {
              currency_name: currency?.name,
            });
          }),
        );
      }

      if (priceForm && !priceTo) {
        querySearch(query, 'invoices.total_value >= :priceForm', priceForm);
      } else if (!priceForm && priceTo) {
        querySearch(query, 'invoices.total_value <= :priceTo', priceTo);
      } else if (priceForm && priceTo && priceTo > priceForm) {
        querySearch(query, 'invoices.total_value <= :priceTo', priceTo);
        querySearch(query, 'invoices.total_value >= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo < priceForm) {
        querySearch(query, 'invoices.total_value >= :priceTo', priceTo);
        querySearch(query, 'invoices.total_value <= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo == priceForm) {
        querySearch(query, 'invoices.total_value = :priceTo', priceTo);
      }

      if (startTime && !endTime) {
        querySearch(query, 'invoices.start_date >= :startTime', startTime);
      } else if (!startTime && endTime) {
        querySearch(query, 'invoices.start_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime > endTime) {
        querySearch(query, 'invoices.start_date <= :startTime', startTime);
        querySearch(query, 'invoices.start_date >= :endTime', endTime);
      } else if (startTime && endTime && startTime < endTime) {
        querySearch(query, 'invoices.start_date >= :startTime', startTime);
        querySearch(query, 'invoices.start_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime == endTime) {
        querySearch(query, 'invoices.start_date = :startTime', startTime);
      }

      if (keyword) {
        query.andWhere(
          new Brackets((q) => {
            q.where('invoices.code LIKE :keyword', { keyword }).orWhere(
              'invoices.customer_name LIKE :keyword',
              {
                keyword: `%${keyword}%`,
              },
            );
          }),
        );
      }

      let [invoices, count] = await query.getManyAndCount();

      invoices = invoices.map((item) => {
        return {
          ...item,
          statusName: this.getInvoiceStatusName(item.status),
        };
      });
      return {
        data: new PaginationResponseWithTotalData<any>(invoices, count),
        sumInvoice: getSumInvoice(
          invoices,
          'total_value',
          customerData?.currency?.sign,
        ),
        balanceDue: getSumInvoice(
          invoices,
          'balanceDue',
          customerData?.currency?.sign,
        ),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findByCode(invoiceCode: string, Headers: any) {
    try {
      const lang = Headers.lang;
      if (!invoiceCode) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.INVOICE_CODE_IS_REQUIRE', {
            lang: lang,
          }),
        );
      }

      const invoiceByCode = await this.invoiceRepository.findOne({
        where: {
          code: invoiceCode,
        },
        relations: {
          order: {
            customer: {
              currency: true,
            },
          },
          payment: true,
        },
      });

      if (!invoiceByCode) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.INVOICE_IS_NOT_FOUND', {
            lang: lang,
          }),
        );
      }

      if (Number(invoiceByCode.status) === InvoiceStatusEnum.Completed) {
        throw new BadRequestException('THIS INVOICE CAN NOT CREATE PAYMENT ');
      }

      return {
        data: invoiceByCode,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  findAllStatus() {
    return {
      data: Object.keys(InvoiceStatusEnum)
        .filter((item: number | string) => {
          return isNaN(+item) && item != InvoiceStatusEnum[0];
        })
        .map((item) => {
          return {
            [InvoiceStatusEnum[item]]: item.replace(/_/g, ' '),
          };
        }),
    };
  }

  async findValiToPaidInvoiceByOrderId(orderId: number) {
    try {
      const invoiceList = await this.invoiceRepository.find({
        relations: {
          order: true,
        },
        where: {
          order: {
            id: orderId,
          },
        },
      });
      const canPaidInvoiceList = invoiceList.filter(
        (invoice) =>
          invoice.status === InvoiceStatusEnum.Request_Sending ||
          invoice.status === InvoiceStatusEnum.Paid ||
          invoice.status === InvoiceStatusEnum.Over_Due ||
          invoice.status === InvoiceStatusEnum.Created,
      );

      return {
        data: new PaginationResponseWithTotalData<any>(
          canPaidInvoiceList,
          canPaidInvoiceList.length,
        ),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findOne(id: number, pagination: PaginationQuery,headers:any, req: RequestWithUser) {
    try {
      const lang = headers.lang
      // const kind = req.user.kind;
      // const userId = req.user.userId
      let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;
      if (id && !(await checkExistInRepo(id, this.invoiceRepository)))
        throw new NotFoundException();
      const invoice = await this.invoiceRepository.findOne({
        where: {
          id,
        },
        relations: {
          invoiceOrderItems: {
            orderItem: true,
          },
          order: { customer: { currency: true } },
          city: true,
          country: true,
          payment: { method: true, invoice: { order: { customer: true } } },
          user: true
        },
      });

      // if(kind === ROLE_NAME.SALE_ASSISTANT && Number(userId) !== Number(invoice?.user?.id)) {
      //   throw new NotFoundException();
      // }
      const invoiceLogNote = {
        ...invoice,
      };

      if (invoice.payment.length === 0) {
        return {
          data: {
            ...invoiceLogNote,
            statusName: this.getInvoiceStatusName(invoice.status).toUpperCase(),
          },
        };
      } else {
        const totalPayment = invoice.payment.reduce((acc, curr) => {
          return acc + Number(curr.amount);
        }, 0);
        return {
          data: {
            ...invoiceLogNote,
            statusName: this.getInvoiceStatusName(invoice.status).toUpperCase(),
            totalPayment,
          },
        };
      }
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
    userId: number,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      const { country_id, province_id, invoice_order_items, ...restData } =
        updateInvoiceDto;

      let invoice: any = null,
        provinceDB: any = null,
        countryDB: any = null;

      invoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: {
          invoiceOrderItems: true,
        },
      });

      if (province_id) {
        provinceDB = await this.cityRepository.findOne({
          where: { id: province_id },
          relations: {
            country: true,
          },
        });
      }

      if (country_id) {
        countryDB = await this.countryRepository.findOne({
          where: { id: country_id },
        });
      }

      if (
        !invoice ||
        invoice.status === InvoiceStatusEnum.Over_Due ||
        invoice.status === InvoiceStatusEnum.Paid ||
        !this.checkInvoiceOrderItemInInvoice(
          invoice.invoiceOrderItems,
          invoice_order_items,
        ) ||
        (provinceDB && +provinceDB.country?.id !== +country_id)
      ) {
        throw new BadRequestException();
      }

      delete restData.lang
      await this.invoiceRepository.update(id, {
        ...restData,
        total_item: invoice_order_items.length,
        total_original_value:
          this.getTotalValueOriginOffAllOrderItem(invoice_order_items),
        total_tax_value:
          this.getTotalTaxRateOfAllOrderItem(invoice_order_items),
        total_value: this.getTotalValueOffAllOrderItem(invoice_order_items),
        balanceDue: this.getTotalValueOffAllOrderItem(invoice_order_items),
        country: country_id ? { id: +country_id } : undefined,
        city: province_id ? { id: +province_id } : undefined,
        user: { id: userId },
        country_name: countryDB ? countryDB.name : null,
        province_name: provinceDB ? provinceDB.name : null,
      });

      await this.formatAndUpdateInvoiceOrderItems(invoice_order_items, id);

      const newInvoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: { invoiceOrderItems: true },
      });

      const data = {
        oldValue: invoice,
        newValue: newInvoice,
      };

      await this.createInvoiceLogNotes(data, +userId, id);

      return {
        data: newInvoice,
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }

      if (e instanceof NotFoundException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  async updateStatusAndCreatePayment(
    dto: CreatePaymentDto,
    req: RequestWithUser,
    payment: any,
    headers,
  ) {
    const lang = headers.lang;
    const { invoiceId, customerId, orderId, currencyId } = dto;
    try {
      const userId = Number(req.user.userId);
      const customer = await this.customerRepository.findOne({
        where: { id: Number(customerId) },
        relations: {
          currency: true,
        },
      });

      // check customer
      if (!customer) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.Cannot_find', {
            lang: lang,
            args: { name: 'Customer' },
          }),
        );
      }

      //check Order

      let order: any = Any;
      if (orderId) {
        order = await this.orderRepository.findOne({
          where: { id: Number(orderId) },
        });

        if (!order) {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.Cannot_find', {
              lang: lang,
              args: { name: 'Order' },
            }),
          );
        }
      }

      //check Currency
      // if request has currency and customer doesn't has currency -> update currencyCustomer

      let currency: any = Any;
      if (currencyId) {
        currency = await this.currencyRepository.findOne({
          where: {
            id: Number(currencyId),
          },
        });

        if (!currency) {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.Cannot_find', {
              lang: lang,
              args: { name: 'Currency' },
            }),
          );
        }

        if (!customer?.currency) {
          customer.currency = currency;
          await this.customerRepository.save(customer);
        }
      }

      //check Invoice

      let invoice: any = Any;

      if (invoiceId) {
        invoice = await this.invoiceRepository.findOne({
          where: { id: invoiceId },
        });
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

        // check Invoice Status where in Request_Sending, Paid, Over_Due, Created

        if (
          +invoice.status != InvoiceStatusEnum?.Request_Sending &&
          +invoice.status != InvoiceStatusEnum?.Paid &&
          +invoice.status != InvoiceStatusEnum?.Over_Due &&
          +invoice.status != InvoiceStatusEnum?.Created
        ) {
          throw new BadRequestException(
            this.i18n.t(
              'message.status_messages.Can_not_create_payment_for_this_invoice',
              {
                lang: lang,
              },
            ),
          );
        }
      }

      //  create Payment
      let description:any;
      if (payment.attachment && payment.attachment?.length > 0) {
        const imageAttach = payment.attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = payment.attachment.filter((items: any) =>
          !items.mimetype.startsWith('image/'),
        );
        description = await attendDescription(
          imageAttach,
          fileAttach,
          payment.notes,
        )
      }
      const newPayment = await this.paymentRepository.save({
        ...payment,
        notes: description,
        invoice: Number(invoiceId) > 0 ? Number(invoiceId) : null,
        customer: customerId,
        order: orderId ? Number(orderId) : null,
        currency: currencyId,
        attachment : null,
      });

      let updateStatusInvoice: any;

      //check if has invoice and invoiceId , set update Status of Invoice

      if (invoice && invoiceId) {
        if (
          newPayment &&
          Number(newPayment.amount) < Number(invoice.balanceDue)
        ) {
          await this.invoiceRepository.update(invoiceId, {
            ...invoice,
            status: InvoiceStatusEnum.Paid,
            balanceDue: Number(invoice.balanceDue) - Number(newPayment.amount),
          });
          updateStatusInvoice = InvoiceStatusEnum.Paid;
        }

        if (
          newPayment &&
          Number(newPayment.amount) >= Number(invoice.balanceDue)
        ) {
          updateStatusInvoice = await this.invoiceRepository.update(invoiceId, {
            ...invoice,
            status: InvoiceStatusEnum.Completed,
            balanceDue: 0,
          });
          updateStatusInvoice = InvoiceStatusEnum.Completed;
        }
      }

      if (newPayment && invoice && invoiceId) {
        const dataSaveLog = {
          amount: newPayment?.amount,
          paymentDate: newPayment?.paymentDate,
          code: invoice?.code,
          status: this.getInvoiceStatusName(updateStatusInvoice),
        };

        const data = {
          oldValue: null,
          newValue: JSON.stringify(dataSaveLog),
        };

        const logNoteInvoice = new DataLogNote(
          +userId,
          LogNoteObject.INVOICE,
          Number(invoiceId),
          LogNoteActions.CREATE_PAYMENT,
          data,
        );
        this.logNoteRepository.save(logNoteInvoice);
        const logNotePayment = new DataLogNote(
          +userId,
          LogNoteObject.PAYMENT,
          Number(newPayment?.id),
          LogNoteActions.CREATE_PAYMENT,
          data,
        );
        this.logNoteRepository.save(logNotePayment);
        const logNoteCustomer = new DataLogNote(
          +userId,
          LogNoteObject.CUSTOMER,
          Number(customer?.id),
          LogNoteActions.CREATE_PAYMENT,
          data,
        );
        this.logNoteRepository.save(logNoteCustomer);
      }

      return {
        data: newPayment,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
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
      const userId = Number(req.user.userId);
      const status = +updateInvoiceStatusDto.status;
      if (
        status != InvoiceStatusEnum.Created &&
        status != InvoiceStatusEnum.Request_Sending
      ) {
        throw new BadRequestException();
      }
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
      });

      if (
        invoice.status === InvoiceStatusEnum.Paid ||
        invoice.status === InvoiceStatusEnum.Completed
      ) {
        throw new BadRequestException();
      }

      const data = {
        before: invoice?.status,
        after: status,
        invoice: invoice.id,
      };

      const updateInvoice = await this.invoiceRepository.update(id, { status });

      if (updateInvoice) {
        await this.createInvoiceStatusLogNote(data, userId);
      }
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

  async createInvoiceStatusLogNote(data: any, userId: number) {
    const newValue = this.getInvoiceStatusName(data?.after);
    const oldValue = this.getInvoiceStatusName(+data?.before);
    const dataValue = {
      oldValue: JSON.stringify(oldValue),
      newValue: JSON.stringify(newValue),
    };
    const logNote = new DataLogNote(
      +userId,
      LogNoteObject.INVOICE,
      Number(data?.invoice),
      LogNoteActions.CHANGE_STATUS,
      dataValue,
    );
    await this.logNoteRepository.save(logNote);
  }

  async remove(id: number, Headers: any) {
    const lang = Headers.lang;
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: {
        tasks: true,
        payment: true,
      },
    });
    if (!invoice) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', {
          lang: lang,
        }),
      );
    }
    if (
      checkExistNestedData(invoice?.tasks) ||
      checkExistNestedData(invoice?.payment)
    ) {
      throw new BadRequestException(
        this.i18n.t('message.status_messages.EXISTED_RELATION_DATA', {
          lang: lang,
        }),
      );
    }
    await this.invoiceRepository.softDelete(id);
    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }

  private async formatAndCreateInvoiceOrderItems(
    invoiceOrderItem: IInvoiceOrderItem[],
  ): Promise<any[]> {
    return await Promise.all(
      invoiceOrderItem.map(async (item): Promise<any> => {
        let orderItem = null;
        if (item.order_item_id) {
          orderItem = await this.orderItemRepository.findOne({
            where: { id: +item.order_item_id },
          });
        }

        const invoiceOrderItem = new InvoiceOrderItem();
        invoiceOrderItem.value = item.value;
        invoiceOrderItem.total_value = this.calculateTotalValue(item);
        invoiceOrderItem.tax_rate = item.tax_rate;
        invoiceOrderItem.name = orderItem ? orderItem.title : item.name;
        invoiceOrderItem.orderItem = orderItem;

        await this.invoiceOrderItemRepository.save(invoiceOrderItem);
        return invoiceOrderItem;
      }),
    );
  }

  private async formatAndUpdateInvoiceOrderItems(
    invoiceOrderItem: IInvoiceOrderItemUpdate[],
    invoiceId: number,
  ): Promise<any[]> {
    let invoiceIds = (
      await this.invoiceOrderItemRepository.find({
        where: { invoice: { id: invoiceId } },
        select: { id: true },
      })
    ).map((item) => +item.id);
    if (invoiceIds.length) {
      await this.invoiceOrderItemRepository.delete(invoiceIds);
    }
    return await Promise.all(
      invoiceOrderItem.map(async (item): Promise<any> => {
        const invoiceOrderItem = new InvoiceOrderItem();
        const invoice = new Invoice();
        invoice.id = invoiceId;
        invoiceOrderItem.value = item.value;
        invoiceOrderItem.total_value = this.calculateTotalValue(item);
        invoiceOrderItem.tax_rate = item.tax_rate;
        invoiceOrderItem.name = item.name;
        invoiceOrderItem.invoice = invoice;
        await this.invoiceOrderItemRepository.save(invoiceOrderItem);

        return invoiceOrderItem;
      }),
    );
  }

  private getTotalValueOriginOffAllOrderItem(
    invoiceOrderItem: Array<IInvoiceOrderItem | IInvoiceOrderItemUpdate>,
  ): number {
    return invoiceOrderItem.reduce((total, item) => total + +item.value, 0);
  }

  private getTotalTaxRateOfAllOrderItem(
    invoiceOrderItem: Array<IInvoiceOrderItem | IInvoiceOrderItemUpdate>,
  ): number {
    return invoiceOrderItem.reduce(
      (total, item) => total + (+item.value * +item.tax_rate) / 100,
      0,
    );
  }

  private getTotalValueOffAllOrderItem(
    invoiceOrderItem: Array<IInvoiceOrderItem | IInvoiceOrderItemUpdate>,
  ): number {
    return (
      this.getTotalValueOriginOffAllOrderItem(invoiceOrderItem) +
      this.getTotalTaxRateOfAllOrderItem(invoiceOrderItem)
    );
  }

  private calculateTotalValue(
    invoiceOrderItem: IInvoiceOrderItem | IInvoiceOrderItemUpdate,
  ): number {
    return (
      +invoiceOrderItem.value +
      (+invoiceOrderItem.value * invoiceOrderItem.tax_rate) / 100
    );
  }

  private async generateCodeInvoice(orderDB: Order): Promise<string> {
    const bullingTypeName = orderDB.billingType?.name;
    const cidCode =
      (orderDB.customer?.country?.name?.toUpperCase() ?? '') +
      orderDB.customer?.cidCode;
    const bullingTypes = await this.orderRepository.find({
      where: {
        billingType: { id: orderDB.billingType?.id },
      },
    });

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const numericOrderInvoice = await this.generateNumericOrderInvoice();
    return `${
      bullingTypeName?.charAt(0).toUpperCase() + bullingTypes.length
    }-${cidCode}-${currentDate}${numericOrderInvoice}`;
  }

  private async generateNumericOrderInvoice(): Promise<string> {
    const currentDate = new Date();
    let nextInvoiceNumber = 0;
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoices')
      .where("DATE_FORMAT(invoices.created_at, '%Y-%m-%d') = :currentDate", {
        currentDate: currentDate.toISOString().split('T')[0],
      })
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

  private getInvoiceStatusName(status: number): string {
    return InvoiceStatusEnum[status].replace(/_/g, ' ');
  }

  private checkOrderItemInOrder(
    orderItemDB: OrderItem[],
    orderItemRequest: IInvoiceOrderItem[],
  ): boolean {
    let isIn = true;
    orderItemRequest.forEach((element) => {
      if (
        element.order_item_id &&
        !orderItemDB.filter((e) => +e.id === +element.order_item_id).length
      ) {
        isIn = false;
      }
    });

    return isIn;
  }

  private checkInvoiceOrderItemInInvoice(
    invoiceOrderItemDB: InvoiceOrderItem[],
    invoiceOrderItemRequest: IInvoiceOrderItemUpdate[],
  ): boolean {
    let isIn = true;
    invoiceOrderItemDB.forEach((element) => {
      if (
        element.id &&
        !invoiceOrderItemDB.filter((e) => +e.id === +element.id).length
      ) {
        isIn = false;
      }
    });

    return isIn;
  }

  async updateName(
    id: number,
    updateInvoiceName: UpdateInvoiceNameDto,
    userId: number,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
      });

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

      const defautlName = invoice.code;

      const findInvoiceName = await this.invoiceRepository.findOne({
        where: {
          code: updateInvoiceName?.code,
        },
      });
      if (findInvoiceName) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.this_InvoiceID_has_found', {
            lang: lang,
          }),
        );
      }

      if (invoice && invoice?.status != InvoiceStatusEnum.Created) {
        throw new NotFoundException(
          this.i18n.t(
            'message.status_messages.You_can_not_update_this_InvoiceCode',
            {
              lang: lang,
            },
          ),
        );
      }

      invoice.code = updateInvoiceName.code;

      await this.invoiceRepository.update(id, {
        ...invoice,
      });

      const value = {
        oldValue: JSON.stringify(defautlName),
        newValue: JSON.stringify(updateInvoiceName.code),
      };

      const logNoteInvoice = new DataLogNote(
        +userId,
        LogNoteObject.INVOICE,
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

  async findInvoiceByCustomerId(id: number) {
    const invoice = await this.invoiceRepository.find({
      where: {
        order: {
          customer: {
            id: id,
          },
        },
        status: Not(5),
      },
    });
  }

  async createInvoiceLogNotes(data: any, userId: number, objectId: number) {
    const compareList = [
      'customer_name',
      'country_name',
      'total_value',
      'province_name',
    ];
    let oldValue: any;
    let newValue: any;
    compareList.forEach(async (item: string) => {
      let action: number;
      switch (item) {
        case 'total_value':
          oldValue = JSON.stringify(formatToStringValue(data?.oldValue[item]));
          newValue = JSON.stringify(formatToStringValue(data?.newValue[item]));
          action = LogNoteActions.CHANGE_VALUE;
          break;
        case 'customer_name':
          oldValue = JSON.stringify(data?.oldValue[item]);
          newValue = JSON.stringify(data?.newValue[item]);
          action = LogNoteActions.CHANGE_INVOICE_CUSTOMER_NAME;
          break;
        case 'province_name':
          oldValue = JSON.stringify(data?.oldValue[item]);
          newValue = JSON.stringify(data?.newValue[item]);
          action = LogNoteActions.CHANGE_PROVINCE;
          break;
        case 'country_name':
          oldValue = JSON.stringify(data?.oldValue[item]);
          newValue = JSON.stringify(data?.newValue[item]);
          action = LogNoteActions.CHANGE_COUNTRY_NAME;
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
          LogNoteObject.INVOICE,
          Number(objectId),
          action,
          value,
        );
        this.logNoteRepository.save(logNoteInvoice);
      }
    });
  }
}
