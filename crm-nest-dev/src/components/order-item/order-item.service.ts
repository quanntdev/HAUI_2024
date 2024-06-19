import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { Currency, Order, OrderStatus, OrderItem, LogNote } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DEFAULT_LIMIT_PAGINATE, ERROR_CODES } from 'src/constants';
import { SUCCESS_CODES } from 'src/constants/successCodes';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from 'src/common/dtos';
import { convertStringToNumber } from 'src/common/utils/convertStringToNumber';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { RequestWithUser } from 'src/common/interfaces';
import { DataLogNote } from 'src/common/utils/logNotesClass';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto, req: RequestWithUser) {
    const userId = req.user.userId;
    try {
      const { orderId, statusId, unitPrice, estimateHour, ...restOrderItem } =
        createOrderItemDto;
      let orderItemCreate: any = restOrderItem;
      let statusIdUpdate: number;

      if (unitPrice && estimateHour) {
        const estimateH = convertStringToNumber(estimateHour);
        const newPrice = convertStringToNumber(unitPrice);
        const valuePrice =
          convertStringToNumber(unitPrice) *
          convertStringToNumber(estimateHour);
        orderItemCreate = {
          ...orderItemCreate,
          unitPrice: newPrice,
          estimateHour: estimateH,
          value: valuePrice,
        };
      }

      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: { currency: true, customer: { currency: true } },
      });

      if (!order?.customer?.currency) {
        throw new BadRequestException(
          'CAN NOT CREATE ORDER ITEM WITHOUT CURRENCY',
        );
      }
      if (orderId && (await checkExistInRepo(orderId, this.orderRepository))) {
        orderItemCreate = {
          ...orderItemCreate,
          order: orderId,
        };
      } else {
        throw new NotFoundException('Can not found order id');
      }

      if (
        statusId &&
        (await checkExistInRepo(statusId, this.orderStatusRepository))
      ) {
        statusIdUpdate = statusId;
      } else {
        const status = await this.orderStatusRepository.findOne({
          where: {
            isDefault: true,
          },
        });

        if (!status) {
          throw new NotFoundException(ERROR_CODES.STATUS_DEFAULT);
        }
        statusIdUpdate = Number(status.id);
      }

      const response = await this.orderItemRepository.save({
        ...orderItemCreate,
        status: statusIdUpdate,
      });
      if (response) {
        const data = {
          oldValue: null,
          newValue: JSON.stringify(response?.title),
        };
        const logNotes = new DataLogNote(
          +userId,
          LogNoteObject.ORDER,
          Number(orderId),
          LogNoteActions.CREATE_ORDER_ITEM,
          data,
        );
        await this.logNoteRepository.save(logNotes);
      }

      return {
        data: await this.orderItemRepository.find({
          relations: {
            status: true,
            order: {
              currency: true,
            },
          },
          where: [{ id: response.id }],
        }),

        message: SUCCESS_CODES.CREATE_SUCCESSFULLY,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAll(pagination: PaginationQuery, statusId: number) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
      } = pagination;
      const query = this.orderItemRepository
        .createQueryBuilder('order_items')
        .leftJoinAndSelect('order_items.status', 'order_statuses')
        .orderBy('order_items.id', 'DESC')
        .skip(offset)
        .take(limit);

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('order_items.title LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (statusId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('order_items.status_id = :statusId', { statusId });
          }),
        );
      }
      const [orderItem, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponseWithTotalData<any>(orderItem, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
  async findByOrderId(
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
      const query = this.orderItemRepository
        .createQueryBuilder('order_items')
        .leftJoinAndSelect('order_items.status', 'order_statuses')
        .leftJoinAndSelect('order_items.order', 'orders')
        .leftJoinAndSelect('orders.currency', 'currencies')
        .andWhere(
          new Brackets((qr) => {
            qr.where('order_items.order_id = :orderId', {
              orderId: `${id}`,
            });
          }),
        )
        .orderBy('order_items.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('order_items.title LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (statusId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('order_items.status_id = :statusId', { statusId });
          }),
        );
      }

      const [orderItem, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponseWithTotalData<any>(orderItem, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.orderItemRepository.findOne({
        relations: {
          order: {
            customer: {
              city: true,
              country: true,
            },
            contact: true,
            status: true,
            billingType: true,
            category: true,
            currency: true,
          },
          status: true,
        },
        where: [{ id }],
      });

      return {
        data,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
    req: RequestWithUser,
  ) {
    const { statusId, unitPrice, estimateHour, ...restOrder } =
      updateOrderItemDto;
    const userId = req.user.userId;
    try {
      let orderItemUpdate: any = restOrder;

      if (unitPrice && estimateHour) {
        const estimateH = convertStringToNumber(estimateHour);
        const newPrice = convertStringToNumber(unitPrice);
        const newValue =
          convertStringToNumber(unitPrice) *
          convertStringToNumber(estimateHour);
        orderItemUpdate = {
          ...orderItemUpdate,
          unitPrice: newPrice,
          estimateHour: estimateH,
          value: newValue,
        };
      }
      delete orderItemUpdate.lang;
      if (
        statusId &&
        (await checkExistInRepo(statusId, this.orderStatusRepository))
      ) {
        orderItemUpdate.status = statusId;
      }

      const orderItem = await this.orderItemRepository.findOne({
        where: { id },
        relations: {
          order: true,
        },
      });

      const data = {
        before: {
          ...orderItem,
          value: convertStringToNumber(orderItem?.value.toString()),
        },
        after: orderItemUpdate,
      };

      const updateOrderItem = await this.orderItemRepository.update(id, {
        ...orderItemUpdate,
      });
      const orderResponse = await this.orderItemRepository.findOne({
        relations: {
          status: true,
          order: { currency: true },
        },
        where: [{ id }],
      });
      return {
        data: orderResponse,
        message: SUCCESS_CODES.UPDATE_SUCCESSFULLY,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    try {
      const { statusId } = updateStatusDto;
      const [orderItem, status] = await Promise.all([
        await this.orderItemRepository.findOne({
          where: { id },
        }),
        await this.orderStatusRepository.findOne({
          where: {
            id: statusId,
          },
        }),
      ]);

      if (!orderItem || !status) {
        throw new NotFoundException(ERROR_CODES.DATA_NOT_FOUND);
      }

      await this.orderItemRepository.update(id, {
        status,
      });

      return {
        data: {
          status,
        },
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async remove(id: number, req: RequestWithUser) {
    try {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id },
        relations: {
          order: true,
        },
      });
      const userId = req.user.userId;
      const orderId = orderItem?.order?.id;
      const orderItemTitle = orderItem?.title;

      if (!orderItem) {
        throw new NotFoundException(ERROR_CODES.DATA_NOT_FOUND);
      }
      const deleteOrderItem = await this.orderItemRepository.softDelete(id);
      if (deleteOrderItem) {
        const data = {
          oldValue: JSON.stringify(orderItemTitle),
          newValue: null,
        };
        const logNotes = new DataLogNote(
          +userId,
          LogNoteObject.ORDER,
          Number(orderId),
          LogNoteActions.DELETE_ORDER_ITEM,
          data,
        );
        this.logNoteRepository.save(logNotes);
      }
      return {
        data: [],
        message: SUCCESS_CODES.DELETE_SUCCESSFULLY,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
