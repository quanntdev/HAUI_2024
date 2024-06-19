import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-oder.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Order } from '../../entities/order.entity';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { querySearch } from 'src/common/utils/querySearch';
import {
  Contact,
  Customer,
  User,
  Deal,
  OrderStatus,
  BillingType,
  Currency,
  Category,
  Invoice,
  LogNote,
  Notification,
  Partner,
  PartnerCustomer,
} from 'src/entities';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationQuery,
  PaginationQueryOrder,
  PaginationResponseWithTotalData,
} from 'src/common/dtos';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { convertStringToNumber } from 'src/common/utils/convertStringToNumber';
import { FindOrderDto } from './dto/find-order.dto';
import { InvoiceStatusEnum } from '../invoices/enum/invoice-status.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { RequestWithUser } from 'src/common/interfaces';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { DataLogNote } from 'src/common/utils/logNotesClass';
import { formatToStringValue } from 'src/common/utils/formatToStringValue';
import {
  DEFAULT_LIMIT_PAGINATE,
  FOMAT_DATE_TIME,
  ROLE_NAME,
  VALUE_RATE_POINT,
} from 'src/constants';
import { NotificationSave } from 'src/common/utils/saveNotifications';
import {
  notificationAction,
  notificationSeenAction,
} from '../notifications/enum/notifications.enum';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { renderFilename } from 'src/common/utils/renderFilename';
import { partnerSaleOption } from '../partner/enum/partner.enum';
import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,

    @InjectRepository(Category)
    private readonly categoryTypeRepository: Repository<Category>,

    @InjectRepository(BillingType)
    private readonly billingTypeRepository: Repository<BillingType>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,

    @InjectRepository(PartnerCustomer)
    private readonly partnerCustomerRepository: Repository<PartnerCustomer>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    req: RequestWithUser,
    Headers,
    attachment: any = null,
  ) {
    const userId = req.user.userId;
    const {
      dealId,
      billingTypeId,
      userAssignId,
      currencyId,
      orderValue,
      partnerSalePercent,

      ...restOrder
    } = createOrderDto;
    let orderCreate: any = restOrder;
    let statusIdUpdate: number;
    let billingTypeIdUpdate: any;

    try {
      const lang = Headers.lang;
      const deal = await this.dealRepository.findOne({
        where: {
          id: +dealId,
        },
        relations: {
          status: true,

          category: true,
          currency: true,
          userAssign: {
            profile: true,
          },
          contact: true,
          customer: true,
        },
      });

      if (!deal) {
        throw new NotFoundException(
          this.i18n.t('message.order.can_not_found_deal_id', { lang: lang }),
        );
      }

      orderCreate = {
        ...orderCreate,
        deal: deal.id,
        deleveryDate: null,
        orderManager: createOrderDto?.orderManager
          ? createOrderDto?.orderManager
          : null,
        review: null,
        ratePoint: null,
        categoryId: null,
        contactId: null,
        price: null,
        currency: deal.currency
          ? Number(deal.currency.id)
          : currencyId
          ? Number(currencyId)
          : null,
        orderValue: orderValue ? convertStringToNumber(orderValue) : deal.price,
        description: restOrder.description,
        customer: deal.customer ? Number(deal.customer.id) : null,
        contact: deal.contact ? Number(deal.contact.id) : null,
        category: deal.category ? Number(deal.category.id) : null,
        userAssign: userAssignId ? Number(userAssignId) : null,
      };

      if (!orderCreate?.statusId) {
        const status = await this.orderStatusRepository.findOne({
          where: {
            isDefault: true,
          },
        });

        if (!status) {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.status_default_not_found', {
              lang: lang,
            }),
          );
        }
        statusIdUpdate = Number(status.id);
      } else {
        statusIdUpdate = orderCreate?.statusId;
      }

      if (
        billingTypeId &&
        (await checkExistInRepo(billingTypeId, this.billingTypeRepository))
      ) {
        billingTypeIdUpdate = billingTypeId;
      } else {
        const billingType = await this.billingTypeRepository.findOne({
          where: {
            isDefault: true,
          },
        });
        if (!billingType) {
          throw new NotFoundException(
            this.i18n.t(
              'message.status_messages.billing_type_default_not_found',
              { lang: lang },
            ),
          );
        }
        billingTypeIdUpdate = Number(billingType.id);
      }

      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = attachment.filter(
          (items: any) => !items.mimetype.startsWith('image/'),
        );
        orderCreate = {
          ...orderCreate,
          description: await this.attendDescription(
            imageAttach,
            fileAttach,
            createOrderDto.description,
          ),
        };
      }

      const response = await this.orderRepository.save({
        ...orderCreate,
        status: statusIdUpdate,
        billingType: billingTypeIdUpdate,
      });

      const dataOrder = await this.orderRepository.findOne({
        relations: {
          status: true,
          billingType: true,
          deal: {
            category: true,
            currency: true,
            userAssign: {
              profile: true,
            },
            contact: true,
            customer: {
              city: true,
              country: true,
              partners: {
                partners: true,
              },
            },
          },
        },
        where: [
          {
            id: response.id,
          },
        ],
      });

      const partner = dataOrder?.deal?.customer?.partners?.[0];
      if (partner?.partners?.id) {
        const isTotalPaymentByPeriod =
          Number(partner.saleType) ===
          partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD;
        const isWithinPeriod =
          new Date(dataOrder.startDate) >= new Date(partner.startDate) &&
          new Date(dataOrder.startDate) <= new Date(partner.endDate);
        const salePercent = isTotalPaymentByPeriod
          ? Number(partner.salePercent)
          : Number(partnerSalePercent);
        const saleValue = (dataOrder.orderValue * salePercent) / 100;
        const saveData: any = {
          partnerCustomer: Number(dataOrder.deal.customer.id),
          partners: Number(partner.partners.id),
          salePercent,
          saleType: Number(partner.saleType),
          startDate: isTotalPaymentByPeriod ? partner.startDate : null,
          endDate: isTotalPaymentByPeriod ? partner.endDate : null,
          partnerOrder: dataOrder.id,
          saleValue,
        };
        if (
          (Number(partner.saleType) ===
            partnerSaleOption.TOTAL_PAYMENT_REVENUE &&
            (salePercent || salePercent == 0)) ||
          (Number(partner.saleType) ===
            partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD &&
            isWithinPeriod)
        ) {
          await this.partnerCustomerRepository.save(saveData);
        }
      }

      if (response) {
        let LogNoteImage = [];

        const log: any = {
          object: LogNoteObject.ORDER,
          objectId: Number(response?.id),
          action: LogNoteActions.CREATE,
          user: +userId,
        };

        LogNoteImage.push(log);
        if (attachment) {
          attachment.forEach((item: any) => {
            const logNote: any = {
              object: LogNoteObject.ORDER,
              objectId: Number(response.id),
              action: item?.mimetype.startsWith('image/')
                ? LogNoteActions.UPLOAD_FILE
                : LogNoteActions.UPLOAD_FILE_RAW,
              user: +userId,
              attachment: item?.filename,
            };
            LogNoteImage.push(logNote);
          });
        }

        const lognote = await this.logNoteRepository.save(LogNoteImage);

        if (userAssignId && userAssignId !== Number(userId)) {
          NotificationSave(
            this.notificationRepository,
            notificationAction.ASSIGNED,
            lognote[0].id,
            notificationSeenAction.NOT_SEEN,
            Number(userAssignId),
          );
        }
      }

      return {
        data: dataOrder,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async attendDescription(imageAttach: any, fileAttach: any, string: string) {
    const regex = /<img src="[^"]*">/g;
    const regaxFile = /<a([^>]*?)href="[^"]*"([^>]*?)>/g;
    let index = 0;
    let C = string.replace(regex, function (match) {
      let imgLink = renderFilename(imageAttach[index].filename);
      index++;
      return '<img src="' + imgLink + '">';
    });
    let index2 = 0;
    let des = C.replace(regaxFile, function (matchF) {
      let fileLink = renderFilename(fileAttach[index2]?.filename);
      index2++;
      return `<a href="${fileLink}" target="_blank" style="background: #091e4214; padding: 5px; border-radius: 5px; font-weight: bold;" rel="noopener">`;
    });

    return des;
  }

  async findAll(
    pagination: PaginationQueryOrder,
    query: FindOrderDto,
    req: RequestWithUser,
  ) {
    const {
      statusId,
      customerId,
      currencyId,
      valueFrom,
      valueTo,
      categoryId,
      startTime,
      endTime,
    } = query;
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
        ratePoint,
      } = pagination;

      const kind = req.user.kind;
      const userId = req.user.userId;
      const query = this.orderRepository
        .createQueryBuilder('orders')
        // .leftJoinAndSelect('orders.contact', 'contacts')
        // .leftJoinAndSelect('orders.userAssign', 'users')
        // .leftJoinAndSelect('orders.items', 'orderItems')
        // .leftJoinAndSelect('partnerOrd.partners', 'partners')
        .leftJoinAndSelect('orders.status', 'order_statuses')
        .leftJoinAndSelect('orders.customer', 'companies')
        .leftJoinAndSelect('orders.category', 'categories')
        .leftJoinAndSelect('orders.currency', 'currencies')
        .leftJoinAndSelect('orders.partners', 'partnerOrd')
        .leftJoinAndSelect('orders.billingType', 'billing_types')
        .orderBy('orders.updatedAt', 'DESC')
        .skip(offset)
        .take(limit);

      const priceForm = Number(valueFrom?.replace(/[^0-9.-]+/g, ''));
      const priceTo = Number(valueTo?.replace(/[^0-9.-]+/g, ''));

      if (kind === ROLE_NAME.SALE_ASSISTANT) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('users.id = :userId', {
              userId: userId,
            });
          }),
        );
      }

      if (keyword) {
        let newKey = keyword.split(' ').join('');
        query.andWhere(
          new Brackets((qr) => {
            qr.where('TRIM(REPLACE(orders.name, " ", "")) LIKE :keyword', {
              keyword: `%${newKey}%`,
            }).orWhere('companies.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (ratePoint) {
        query.andWhere(
          new Brackets((qr) => {
            if (ratePoint == VALUE_RATE_POINT.SHORT) {
              qr.where('orders.ratePoint BETWEEN 1 AND 6');
            } else if (ratePoint == VALUE_RATE_POINT.MEDIUM) {
              qr.where('orders.ratePoint BETWEEN 7 AND 8');
            } else if (ratePoint == VALUE_RATE_POINT.HEIGHT) {
              qr.where('orders.ratePoint BETWEEN 9 AND 10');
            }
          }),
        );
      }

      statusId && querySearch(query, 'orders.status_id = :statusId', statusId);

      customerId &&
        querySearch(query, 'orders.customer_id = :customerId', customerId);

      currencyId &&
        querySearch(query, 'orders.currency_id = :currencyId', currencyId);

      categoryId &&
        querySearch(query, 'orders.category_id = :categoryId', categoryId);

      if (priceForm && !priceTo) {
        querySearch(query, 'orders.order_value >= :priceForm', priceForm);
      } else if (!priceForm && priceTo) {
        querySearch(query, 'orders.order_value <= :priceTo', priceTo);
      } else if (priceForm && priceTo && priceTo > priceForm) {
        querySearch(query, 'orders.order_value <= :priceTo', priceTo);
        querySearch(query, 'orders.order_value >= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo < priceForm) {
        querySearch(query, 'orders.order_value >= :priceTo', priceTo);
        querySearch(query, 'orders.order_value <= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo == priceForm) {
        querySearch(query, 'orders.order_value = :priceTo', priceTo);
      }

      if (startTime && !endTime) {
        querySearch(query, 'orders.start_date >= :startTime', startTime);
      } else if (!startTime && endTime) {
        querySearch(query, 'orders.start_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime > endTime) {
        querySearch(query, 'orders.start_date <= :startTime', startTime);
        querySearch(query, 'orders.start_date >= :endTime', endTime);
      } else if (startTime && endTime && startTime < endTime) {
        querySearch(query, 'orders.start_date >= :startTime', startTime);
        querySearch(query, 'orders.start_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime == endTime) {
        querySearch(query, 'orders.start_date = :startTime', startTime);
      }

      const [orders, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponseWithTotalData<any>(orders, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findByDealId(
    id: number,
    pagination: PaginationQuery,
    statusId: number,
  ) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
      } = pagination;
      const query = this.orderRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.status', 'order_statuses')
        .leftJoinAndSelect('orders.currency', 'currencies')
        .andWhere(
          new Brackets((qr) => {
            qr.where('orders.deal_id = :dealId', {
              dealId: `${id}`,
            });
          }),
        )
        .orderBy('orders.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('orders.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (statusId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('orders.status_id = :statusId', { statusId });
          }),
        );
      }

      const [orders, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponseWithTotalData<any>(orders, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
  async findByCustomerId(
    id: number,
    pagination: PaginationQuery,
    statusId: number,
  ) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
      } = pagination;
      const query = this.orderRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.status', 'order_statuses')
        .leftJoinAndSelect('orders.currency', 'currencies')
        .andWhere(
          new Brackets((qr) => {
            qr.where('orders.customer_id = :customerId', {
              customerId: `${id}`,
            });
          }),
        )
        .orderBy('orders.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('orders.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (statusId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('orders.status_id = :statusId', { statusId });
          }),
        );
      }

      const [orders, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponseWithTotalData<any>(orders, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
  async findByCustomerIdAndCreatePayment(id: number) {
    try {
      const orders = await this.orderRepository.find({
        relations: {
          customer: {},
          invoices: true,
        },
        where: [{ customer: { id } }],
      });

      const invoiceExistedOrderList = orders.filter(
        (order) => order.invoices.length > 0,
      );
      return {
        data: new PaginationResponseWithTotalData<any>(
          invoiceExistedOrderList,
          invoiceExistedOrderList.length,
        ),
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
      const userId = req.user.userId;
      let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;
      if (id && !(await checkExistInRepo(id, this.orderRepository)))
        throw new NotFoundException();
      const order: any = await this.orderRepository.findOne({
        relations: {
          customer: {
            city: true,
            country: true,
            industry: true,
            currency: true,
            partners: {
              partners: true,
            },
          },
          contact: true,
          items: true,
          status: true,
          userAssign: {
            profile: true,
          },
          currency: true,
          billingType: true,
          category: true,
          invoices: {
            invoiceOrderItems: true,
            payment: true,
          },
          partners: {
            partners: true,
          },
        },
        where: [
          {
            id: id,
          },
        ],
      });

      if (
        kind === ROLE_NAME.SALE_ASSISTANT &&
        Number(userId) !== Number(order?.userAssign?.id)
      ) {
        throw new NotFoundException();
      }
      const listPayment = order.invoices
        .map((invoice: any) => invoice.payment)
        .flatMap((item: any) => item);
      let totalOrderItems = 0,
        totalValueOrderItem = 0,
        totalInvoice = 0,
        totalValueInvoice = 0,
        totalPayment = 0,
        totalValuePayment = 0,
        totalInVoiceOverDue = 0,
        totalValueInvoiceOverDue = 0;

      totalOrderItems = order.items.length;

      totalValueOrderItem =
        order.items.reduce(
          (accumulator: any, currentValue: any) => {
            return (
              accumulator + parseInt(currentValue?.value?.split(',').join(''))
            );
          },

          0,
        ) ?? 0;

      order.invoices.forEach((item: any) => {
        totalInvoice = order.invoices.length;
        totalValueInvoice += +item.total_value;
        if (Number(item.status) == InvoiceStatusEnum.Over_Due) {
          totalInVoiceOverDue += 1;
          totalValueInvoiceOverDue += Number(item.total_value);
        }
      });
      listPayment.forEach((item: any) => {
        totalPayment = listPayment.length;
        totalValuePayment += Number(item.amount);
      });

      const logNotes = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.ORDER,
        offset,
        limit,
      );

      return {
        data: {
          ...order,
          logNotes: transformLogNote(logNotes, lang, this.i18n),
          totalOrderItems,
          totalValueOrderItem,
          totalInvoice,
          totalValueInvoice,
          totalPayment,
          totalValuePayment,
          totalInVoiceOverDue,
          totalValueInvoiceOverDue,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    req: RequestWithUser,
    updateOrderDto: UpdateOrderDto,
    Headers,
  ) {
    const userId = Number(req.user.userId);
    const lang = Headers.lang;
    const {
      contactId,
      userAssignId,
      billingTypeId,
      currencyId,
      categoryId,
      orderValue,
      partnerSalePercent,
      ...restOrder
    } = updateOrderDto;
    try {
      let orderUpdate: any = restOrder;
      delete orderUpdate.lang;
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: {
          items: true,
          currency: true,
          userAssign: true,
          customer: true,
        },
      });
      if (orderValue) {
        const newPrice = convertStringToNumber(orderValue);
        orderUpdate = {
          ...orderUpdate,
          orderValue: newPrice,
        };
      }
      if (
        billingTypeId &&
        (await checkExistInRepo(billingTypeId, this.billingTypeRepository))
      ) {
        orderUpdate = {
          ...orderUpdate,
          billingType: billingTypeId,
        };
      }

      if (currencyId) {
        const currencyItems = await this.currencyRepository.findOne({
          where: {
            id: Number(currencyId),
          },
        });

        if (!currencyItems) {
          throw new NotFoundException(
            this.i18n.t('message.order.cannot_find_currency', { lang: lang }),
          );
        }

        const customer = await this.customerRepository.findOne({
          where: {
            id: Number(order.customer.id),
          },
        });

        if (!customer?.currency) {
          customer.currency = currencyItems;
          await this.customerRepository.save(customer);
        } else {
          throw new NotFoundException(
            this.i18n.t('message.order.cannot_update_currency', { lang: lang }),
          );
        }
        if (
          !order?.currency &&
          (await checkExistInRepo(currencyId, this.currencyRepository))
        ) {
          if (order.items.length > 0 && currencyId != order.currency.id) {
            throw new BadRequestException(
              this.i18n.t('message.order.CAN_NOT_CHANGE_ORDER_CURRENCY', {
                lang: lang,
              }),
            );
          }
          orderUpdate = {
            ...orderUpdate,
            currency: currencyId,
          };
        }
      }

      if (
        contactId &&
        (await checkExistInRepo(contactId, this.contactRepository))
      ) {
        orderUpdate = {
          ...orderUpdate,
          contact: contactId,
        };
      }

      if (
        userAssignId &&
        (await checkExistInRepo(userAssignId, this.userRepository))
      ) {
        orderUpdate = {
          ...orderUpdate,
          userAssign: userAssignId,
        };
      }

      if (
        categoryId &&
        (await checkExistInRepo(categoryId, this.categoryTypeRepository))
      ) {
        orderUpdate = {
          ...orderUpdate,
          category: categoryId,
        };
      }

      const updateOrder = await this.orderRepository.update(id, {
        ...orderUpdate,
        updatedAt: moment(new Date()).format(FOMAT_DATE_TIME),
      });

      const orderResponse = await this.orderRepository.findOne({
        relations: {
          customer: {
            city: true,
            country: true,
            partners: {
              partners: true,
            },
          },
          contact: true,
          status: true,
          userAssign: {
            profile: true,
          },
          currency: true,
          billingType: true,
          category: true,
          deal: true,
        },
        where: { id },
      });

      const data = {
        before: order,
        after: orderResponse,
      };

      if (!!updateOrder) {
        await this.createOrderLogNotes(
          data,
          +userId,
          id,
          userAssignId,
          order?.userAssign?.id,
        );
      }

      const orderPartner = await this.partnerCustomerRepository.findOne({
        where: {
          partnerOrder: {
            id: id,
          },
        },
        relations: {
          partnerCustomer: true,
        },
      });

      if (orderPartner && partnerSalePercent) {
        if (
          Number(orderPartner?.salePercent) !== Number(partnerSalePercent) &&
          Number(orderPartner?.saleType) !==
            partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD
        ) {
          const saveData: any = {
            salePercent: Number(partnerSalePercent),
            saleValue:
              (Number(orderResponse?.orderValue) * partnerSalePercent) / 100,
          };
          await this.partnerCustomerRepository.update(+orderPartner?.id, {
            ...saveData,
          });
        }
      }

      return {
        data: orderResponse,
        message: this.i18n.t('message.status_messages.update_success', {
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
    updateStatusDto: UpdateStatusDto,
    Headers,
  ) {
    const lang = Headers.lang;
    const userId = Number(req.user.userId);
    const { statusId } = updateStatusDto;
    const [order, status] = await Promise.all([
      await this.orderRepository.findOne({
        where: { id },
        relations: { status: true },
      }),
      await this.orderStatusRepository.findOne({
        where: {
          id: statusId,
        },
      }),
    ]);

    const data = {
      before: order?.status,
      after: Number(statusId),
      orderId: order?.id,
    };

    if (!order || !status) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', { lang: lang }),
      );
    }

    const updateStatus = await this.orderRepository.update(id, {
      status,
    });

    if (updateStatus) {
      await this.createOrderStatusLogNote(data, userId);
    }

    return {
      data: {
        status,
      },
    };
  }

  async createOrderLogNotes(
    data: any,
    userId: number,
    objectId: number,
    userAssignId: number = null,
    userAssignDefault: number = null,
  ) {
    const compareList = [
      'startDate',
      'dueDate',
      'deleveryDate',
      'orderValue',
      'currency',
      'userAssign',
      'description',
    ];
    compareList.forEach(async (item: string) => {
      if (
        JSON.stringify(data?.before[item]) != JSON.stringify(data?.after[item])
      ) {
        let action: number;
        switch (item) {
          case 'startDate':
            action = LogNoteActions.CHANGE_START_DATE;
            break;
          case 'dueDate':
            action = LogNoteActions.CHANGE_DUE_DATE;
            break;
          case 'deleveryDate':
            action = LogNoteActions.CHANGE_DELIVERY_DATE;
            break;
          case 'orderValue':
            action = LogNoteActions.CHANGE_VALUE;
            break;
          case 'currency':
            action = LogNoteActions.CHANGE_CURENCY;
            break;
          case 'userAssign':
            action = LogNoteActions.USER_ASIGN;
            break;
          case 'description':
            action = LogNoteActions.CHANGE_DESCRIPTION;
            break;
          default:
            return;
        }

        if (action === LogNoteActions.CHANGE_DESCRIPTION) {
          const oldDes = data?.before?.description;
          const newDes = data?.after?.description;
          const dataValue = {
            oldValue: JSON.stringify(oldDes),
            newValue: JSON.stringify(newDes),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.ORDER,
            objectId,
            action,
            dataValue,
          );
          return await this.logNoteRepository.save(logNote);
        }
        if (action === LogNoteActions.CHANGE_CURENCY) {
          const oldCurrency = data?.before?.currency?.name;
          const newCurrency = data?.after?.currency?.name;
          const dataValue = {
            oldValue: JSON.stringify(oldCurrency),
            newValue: JSON.stringify(newCurrency),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.ORDER,
            objectId,
            action,
            dataValue,
          );

          const lognote = await this.logNoteRepository.save(logNote);
          if (
            userAssignDefault &&
            Number(userAssignDefault) !== Number(userId)
          ) {
            NotificationSave(
              this.notificationRepository,
              notificationAction.EDIT,
              lognote.id,
              notificationSeenAction.NOT_SEEN,
              Number(userAssignDefault),
            );
          }
        } else if (action === LogNoteActions.USER_ASIGN) {
          if (data?.before[item]?.id !== data?.after[item]?.id) {
            const newLog: any = {
              object: LogNoteObject.ORDER,
              objectId: Number(data?.before?.id),
              action: LogNoteActions.USER_ASIGN,
              oldValue: data?.before?.userAssign?.id
                ? JSON.stringify(
                    await this.getUserValue(
                      Number(data?.before?.userAssign?.id),
                    ),
                  )
                : '',
              newValue:
                JSON.stringify(
                  await this.getUserValue(Number(data?.after?.userAssign?.id)),
                ) ?? '',
              user: userId,
            };
            const lognote = await this.logNoteRepository.save(newLog);
            if (userAssignId && Number(userAssignId) !== Number(userId)) {
              NotificationSave(
                this.notificationRepository,
                notificationAction.ASSIGNED,
                lognote.id,
                notificationSeenAction.NOT_SEEN,
                Number(userAssignId),
              );
            }
          }
        } else {
          const oldValue =
            action === LogNoteActions.CHANGE_VALUE
              ? formatToStringValue(data?.before[item]) +
                data?.before?.currency?.sign
              : data?.before[item];
          const newValue =
            action === LogNoteActions.CHANGE_VALUE
              ? formatToStringValue(data?.after[item]) +
                data?.before?.currency?.sign
              : data?.after[item];

          const dataValue = {
            oldValue: JSON.stringify(oldValue),
            newValue: JSON.stringify(newValue),
          };
          const logNote = new DataLogNote(
            +userId,
            LogNoteObject.ORDER,
            objectId,
            action,
            dataValue,
          );
          const lognote = await this.logNoteRepository.save(logNote);
          if (
            userAssignDefault &&
            Number(userAssignDefault) !== Number(userId)
          ) {
            NotificationSave(
              this.notificationRepository,
              notificationAction.EDIT,
              lognote.id,
              notificationSeenAction.NOT_SEEN,
              Number(userAssignDefault),
            );
          }
        }
      }
    });
  }

  async createOrderStatusLogNote(data: any, userId: number) {
    const statusOrder = await this.orderStatusRepository.find();
    const statusNew = await this.getOrderStatus(data?.after, statusOrder)[0]
      ?.name;
    const dataValue = {
      oldValue: JSON.stringify(data?.before.name),
      newValue: JSON.stringify(statusNew),
    };
    const logNote = new DataLogNote(
      +userId,
      LogNoteObject.ORDER,
      Number(data?.orderId),
      LogNoteActions.CHANGE_STATUS,
      dataValue,
    );
    await this.logNoteRepository.save(logNote);
  }

  private getOrderStatus(statusId: any, statusOrder: any) {
    return statusOrder?.filter((item: any) => Number(item?.id) === statusId);
  }

  async remove(id: number, Headers) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        invoices: true,
        tasks: true,
        items: true,
        payment: true,
      },
    });

    const lang = Headers.lang;

    if (!order) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', { lang: lang }),
      );
    }
    if (
      checkExistNestedData(order?.invoices) ||
      checkExistNestedData(order?.tasks) ||
      checkExistNestedData(order?.items) ||
      checkExistNestedData(order?.payment)
    ) {
      throw new BadRequestException(
        this.i18n.t('message.status_messages.existed_relation_data', {
          lang: lang,
        }),
      );
    }

    await this.orderRepository.softDelete(id);
    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }

  private async getUserValue(id: number) {
    const data = await this.userRepository.findOne({
      where: { id: id },
      relations: {
        profile: true,
      },
    });

    return data.profile.first_name + data.profile.last_name;
  }

  async getOrderOfPartner(id: number, header: any) {
    try {
      const order = await this.orderRepository.find({
        where: {
          partners: {
            partners: {
              id: id,
            },
          },
        },
      });

      return {
        data: order,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
