import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { Tag } from '../../entities/tag.entity';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from '../../entities/deal.entity';
import { Brackets, Repository } from 'typeorm';
import { Contact } from '../../entities/contact.entity';
import { Category } from '../../entities/category.entity';
import { Customer } from '../../entities/customer.entity';
import { User } from '../../entities/user.entity';
import { Currency } from '../../entities/currency.entity';
import { PaginationQuery } from '../../common/dtos';
import { Status } from '../../entities/status.entity';
import { PaginationResponse } from '../../common/dtos/pagination';
import { UpdateStatusDto } from './dto/update-status.dto';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { convertStringToNumber } from 'src/common/utils/convertStringToNumber';
import { FindDealDto } from './dto/find-deal.dto';
import { querySearch } from 'src/common/utils/querySearch';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { LogNote, Notification } from 'src/entities';
import { RequestWithUser } from 'src/common/interfaces';
import { DEFAULT_LIMIT_PAGINATE, FOMAT_DATE_TIME, ROLE_NAME } from 'src/constants';
import { NotificationSave } from 'src/common/utils/saveNotifications';
import {
  notificationAction,
  notificationSeenAction,
} from '../notifications/enum/notifications.enum';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { renderFilename } from 'src/common/utils/renderFilename';
import * as moment from 'moment';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private i18n: I18nService<I18nTranslations>,
  ) {}
  async create(
    createDealDto: CreateDealDto,
    req: RequestWithUser,
    Headers,
    attachment: any = null,
  ) {
    const createdUserId = req.user.userId;
    try {
      const lang = Headers.lang;
      const {
        customerId,
        contactId,
        categoryId,
        userAssignId,
        currencyId,
        tagId,
        statusId,
        price,
        ...restDeal
      } = createDealDto;
      let tagIds = [];
      let dealCreate: any = restDeal;
      let statusIdUpdate: number = +statusId;

      if (price) {
        const newPrice = convertStringToNumber(price);
        dealCreate = {
          ...dealCreate,
          price: newPrice,
        };
      }
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
        relations: {
          currency: true,
        },
      });

      if (!customer) {
        throw new NotFoundException(
          this.i18n.t('message.deal.cannot_found_this_customer', {
            lang: lang,
          }),
        );
      } else if (
        customerId &&
        (await checkExistInRepo(customerId, this.customerRepository))
      ) {
        dealCreate = {
          ...dealCreate,
          customer: customerId,
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
            this.i18n.t('message.deal.cannot_find_currency', { lang: lang }),
          );
        }

        if (!customer?.currency) {
          customer.currency = currencyItems;
          await this.customerRepository.save(customer);
        }

        if (await checkExistInRepo(currencyId, this.currencyRepository)) {
          dealCreate = {
            ...dealCreate,
            currency: currencyId,
          };
        }
      }

      if (
        contactId &&
        (await checkExistInRepo(contactId, this.contactRepository))
      ) {
        dealCreate = {
          ...dealCreate,
          contact: contactId,
        };
      }

      if (
        categoryId &&
        (await checkExistInRepo(categoryId, this.categoryRepository))
      ) {
        dealCreate = {
          ...dealCreate,
          category: categoryId,
        };
      }

      if (
        userAssignId &&
        (await checkExistInRepo(userAssignId, this.userRepository))
      ) {
        dealCreate = {
          ...dealCreate,
          userAssign: userAssignId,
        };
      }

      if (tagId && (await this.checkTag(tagId))) {
        tagId.split(',').forEach((element) => {
          const tag = new Tag();
          tag.id = +element;

          tagIds.push(tag);
        });

        dealCreate = {
          ...dealCreate,
          tags: tagIds,
        };
      }

      if (
        !statusId ||
        !(await checkExistInRepo(statusId, this.statusRepository))
      ) {
        const status = await this.statusRepository.findOne({
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
        statusIdUpdate = status.id;
      }

      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = attachment.filter(
          (items: any) => !items.mimetype.startsWith('image/'),
        );
        dealCreate = {
          ...dealCreate,
          description: await this.attendDescription(
            imageAttach,
            fileAttach,
            createDealDto.description,
          ),
        };
      }

      const response = await this.dealRepository.save({
        ...dealCreate,
        status: statusIdUpdate,
      });

      if (response) {
        let LogNoteImage = [];

        const newLog: any = {
          object: LogNoteObject.DEAL,
          objectId: Number(response.id),
          action: LogNoteActions.CREATE,
          user: +createdUserId,
        };

        LogNoteImage.push(newLog);
        if (attachment) {
          attachment.forEach((item: any) => {
            const logNote: any = {
              object: LogNoteObject.DEAL,
              objectId: Number(response.id),
              action: item?.mimetype.startsWith('image/')
                ? LogNoteActions.UPLOAD_FILE
                : LogNoteActions.UPLOAD_FILE_RAW,
              user: +createdUserId,
              attachment: item?.filename,
            };
            LogNoteImage.push(logNote);
          });
        }

        const lognote = await this.logNoteRepository.save(LogNoteImage);
        if (userAssignId && userAssignId !== Number(createdUserId)) {
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
        data: response,
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
    pagination: PaginationQuery,
    query: FindDealDto,
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
      listStatus,
    } = query;

    const priceForm = Number(valueFrom?.replace(/[^0-9.-]+/g, ''));
    const priceTo = Number(valueTo?.replace(/[^0-9.-]+/g, ''));

    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
      } = pagination;

      const kind = req.user.kind;
      const userId = Number(req.user.userId);
      const query = this.dealRepository
        .createQueryBuilder('deals')
        // .leftJoinAndSelect('deals.contact', 'contacts')
        // .leftJoinAndSelect('deals.currency', 'currencies')
        // .leftJoinAndSelect('deals.tags', 'tags')
        .leftJoinAndSelect('deals.customer', 'companies')
        .leftJoinAndSelect('deals.category', 'categories')
        .leftJoinAndSelect('deals.userAssign', 'users')
        .leftJoinAndSelect('users.profile', 'profiles')
        .leftJoinAndSelect('deals.status', 'statuses')
        .orderBy('deals.updatedAt', 'DESC')
        .skip(offset)
        .take(limit);

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
        query.andWhere(
          new Brackets((qr) => {
            qr.where('deals.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            }).orWhere('companies.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (listStatus) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('deals.status_id IN (:listStatus)', {
              listStatus: listStatus.split(','),
            });
          }),
        );
      }

      statusId && querySearch(query, 'deals.status_id = :statusId', statusId);

      customerId &&
        querySearch(query, 'deals.customer_id = :customerId', customerId);

      currencyId &&
        querySearch(query, 'deals.currency_id = :currencyId', currencyId);

      categoryId &&
        querySearch(query, 'deals.category_id = :categoryId', categoryId);

      if (priceForm && !priceTo) {
        querySearch(query, 'deals.price >= :priceForm', priceForm);
      } else if (!priceForm && priceTo) {
        querySearch(query, 'deals.price <= :priceTo', priceTo);
      } else if (priceForm && priceTo && priceTo > priceForm) {
        querySearch(query, 'deals.price <= :priceTo', priceTo);
        querySearch(query, 'deals.price >= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo < priceForm) {
        querySearch(query, 'deals.price >= :priceTo', priceTo);
        querySearch(query, 'deals.price <= :priceForm', priceForm);
      } else if (priceForm && priceTo && priceTo == priceForm) {
        querySearch(query, 'deals.price = :priceTo', priceTo);
      }

      if (startTime && !endTime) {
        querySearch(
          query,
          'deals.forecast_close_date >= :startTime',
          startTime,
        );
      } else if (!startTime && endTime) {
        querySearch(query, 'deals.forecast_close_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime > endTime) {
        querySearch(
          query,
          'deals.forecast_close_date <= :startTime',
          startTime,
        );
        querySearch(query, 'deals.forecast_close_date >= :endTime', endTime);
      } else if (startTime && endTime && startTime < endTime) {
        querySearch(
          query,
          'deals.forecast_close_date >= :startTime',
          startTime,
        );
        querySearch(query, 'deals.forecast_close_date <= :endTime', endTime);
      } else if (startTime && endTime && startTime == endTime) {
        querySearch(query, 'deals.forecast_close_date = :startTime', startTime);
      }
      const [deal, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponse<any>(deal, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findOne(
    id: number,
    req: RequestWithUser,
    pagination: PaginationQuery,
    headers: any,
  ) {
    const lang = headers.lang;
    const userId = Number(req.user.userId);
    let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;
    const isLoggedInUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    try {
      if (id && !(await checkExistInRepo(id, this.dealRepository)))
        throw new NotFoundException();

      const data = await this.dealRepository.findOne({
        relations: {
          customer: {
            industry: true,
            currency: true,
            partners: {
              partners: true,
              partnerCustomer: true,
              partnerOrder: true,
            },
          },
          contact: true,
          category: true,
          currency: true,
          tags: true,
          status: true,
          userAssign: {
            profile: true,
          },
        },
        where: [{ id }],
      });

      const response = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.DEAL,
        offset,
        limit,
      );

      return {
        data,
        logNote: transformLogNote(response, lang, this.i18n),
      };
    } catch (e) {
      throw e;
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
      const query = this.dealRepository
        .createQueryBuilder('deals')
        .leftJoinAndSelect('deals.status', 'statuses')
        .leftJoinAndSelect('deals.category', 'categories')
        .leftJoinAndSelect('deals.currency', 'currencies')
        .leftJoinAndSelect('deals.customer', 'customers')
        .andWhere(
          new Brackets((qr) => {
            qr.where('deals.customer_id = :customerId', {
              customerId: `${id}`,
            });
          }),
        )
        .orderBy('deals.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('deals.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (statusId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('deals.status_id = :statusId', { statusId });
          }),
        );
      }

      const [deals, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponse<any>(deals, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    updateDealDto: UpdateDealDto,
    req: RequestWithUser,
    Headers,
  ) {
    try {
      const lang = Headers.lang;
      const {
        customerId,
        contactId,
        categoryId,
        userAssignId,
        currencyId,
        tagId,
        statusId,
        price,
        ...restDeal
      } = updateDealDto;
      let tagIds = [];
      let dealUpdate: any = restDeal;
      delete dealUpdate.lang;
      const userId = Number(req.user.userId);
      let deal: any = await this.dealRepository.findOne({
        where: { id },
        relations: { user: true, currency: true, userAssign: true },
      });
      if (price) {
        const newPrice = convertStringToNumber(price);
        dealUpdate = {
          ...dealUpdate,
          price: newPrice,
        };
      }

      let customerData: any = null;
      if (customerId) {
        customerData = await this.customerRepository.findOne({
          where: { id: Number(customerId) },
          relations: { currency: true },
        });

        if (!customerData) {
          throw new BadRequestException(
            this.i18n.t('message.deal.cannot_found_this_customer', {
              lang: lang,
            }),
          );
        }

        dealUpdate = {
          ...dealUpdate,
          customer: customerId,
        };
      }

      if (
        contactId &&
        (await checkExistInRepo(contactId, this.contactRepository))
      ) {
        dealUpdate = {
          ...dealUpdate,
          contact: contactId,
        };
      }

      if (
        categoryId &&
        (await checkExistInRepo(categoryId, this.categoryRepository))
      ) {
        dealUpdate = {
          ...dealUpdate,
          category: categoryId,
        };
      }

      if (
        userAssignId &&
        (await checkExistInRepo(userAssignId, this.userRepository))
      ) {
        dealUpdate = {
          ...dealUpdate,
          userAssign: userAssignId,
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
            this.i18n.t('message.deal.cannot_find_currency', { lang: lang }),
          );
        }

        if (!customerData?.currency) {
          customerData.currency = currencyItems;
          await this.customerRepository.save(customerData);
        }

        if (
          !deal.currency &&
          (await checkExistInRepo(currencyId, this.currencyRepository))
        ) {
          dealUpdate = {
            ...dealUpdate,
            currency: currencyId,
          };
        }
      }

      if (
        statusId &&
        (await checkExistInRepo(statusId, this.statusRepository))
      ) {
        dealUpdate = {
          ...dealUpdate,
          status: statusId,
          updatedAt: moment(new Date()).format(FOMAT_DATE_TIME),
        };
      }

      const newDeal = {
        ...deal,
        ...dealUpdate,
      };

      await this.dealRepository.update(id, dealUpdate);

      // if (!tagId || (await this.checkTag(tagId))) {
      //   dealDB.tags = [];
      //   await this.dealRepository.save(dealDB);
      // }

      // if (tagId && (await this.checkTag(tagId))) {
      //   tagId.split(',').forEach((element) => {
      //     const tag = new Tag();
      //     tag.id = +element;

      //     tagIds.push(tag);
      //   });

      //   dealDB.tags = tagIds;
      //   await this.dealRepository.save(dealDB);
      // }

      const dealResponse = await this.dealRepository.findOne({
        where: { id },
        relations: {
          customer: true,
          contact: true,
          category: true,
          userAssign: true,
          currency: true,
          tags: true,
          status: true,
        },
      });

      if (dealResponse) {
        await this.createDealLogNotes(
          deal,
          newDeal,
          +userId,
          userAssignId,
          deal?.userAssign?.id,
        );
      }

      return {
        data: dealResponse,
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async createDealLogNotes(
    before: any,
    after: any,
    userId: number,
    userAssign: number = null,
    userAssignDefault: number = null,
  ) {
    const compareList = [
      'name',
      'price',
      'currency',
      'userAssign',
      'description',
    ];
    compareList?.forEach(async (item: string) => {
      if (JSON.stringify(before[item]) != JSON.stringify(after[item])) {
        let action: number;
        switch (item) {
          case 'name':
            action = LogNoteActions.CHANGE_NAME;
            break;
          case 'price':
            if (Number(before[item]) != after[item]) {
              const newLog: any = {
                object: LogNoteObject.DEAL,
                objectId: Number(before?.id),
                action: LogNoteActions.CHANGE_VALUE,
                oldValue: JSON.stringify(before[item]) ?? '',
                newValue: JSON.stringify(after[item].toString()) ?? '',
                user: userId,
              };
              return await this.logNoteRepository.save(newLog);
            }
            break;
          case 'currency':
            if (before[item].id != after[item]) {
              const newLog: any = {
                object: LogNoteObject.DEAL,
                objectId: Number(before?.id),
                action: LogNoteActions.CHANGE_CURENCY,
                oldValue: JSON.stringify(before[item]?.name) ?? '',
                newValue:
                  JSON.stringify(await this.getCurrencyValue(after[item])) ??
                  '',
                user: userId,
              };
              return await this.logNoteRepository.save(newLog);
            }
            break;
          case 'userAssign':
            if (Number(before[item]?.id) != Number(after[item])) {
              const newLog: any = {
                object: LogNoteObject.DEAL,
                objectId: Number(before?.id),
                action: LogNoteActions.USER_ASIGN,
                oldValue:
                  JSON.stringify(await this.getUserValue(before[item]?.id)) ??
                  '',
                newValue:
                  JSON.stringify(await this.getUserValue(after[item])) ?? '',
                user: userId,
              };
              const Userlognote = await this.logNoteRepository.save(newLog);
              if (userAssign && Number(userAssign) !== userId) {
                NotificationSave(
                  this.notificationRepository,
                  notificationAction.ASSIGNED,
                  Userlognote.id,
                  notificationSeenAction.NOT_SEEN,
                  Number(userAssign),
                );
              }
            }
            break;
          case 'description':
            if (Number(before[item]?.id) != Number(after[item])) {
              const newLog: any = {
                object: LogNoteObject.DEAL,
                objectId: Number(before?.id),
                action: LogNoteActions.CHANGE_DESCRIPTION,
                oldValue:
                  JSON.stringify(await this.getUserValue(before[item]?.id)) ??
                  '',
                newValue:
                  JSON.stringify(await this.getUserValue(after[item])) ?? '',
                user: userId,
              };
              return await this.logNoteRepository.save(newLog);
            }
            break;
        }
        if (action) {
          const newLog: any = {
            object: LogNoteObject.DEAL,
            objectId: Number(before?.id),
            action,
            oldValue: JSON.stringify(before[item]) ?? '',
            newValue: JSON.stringify(after[item]) ?? '',
            user: userId,
          };
          const relognote = await this.logNoteRepository.save(newLog);
          if (userAssignDefault && Number(userAssignDefault) !== userId) {
            NotificationSave(
              this.notificationRepository,
              notificationAction.EDIT,
              relognote.id,
              notificationSeenAction.NOT_SEEN,
              Number(userAssignDefault),
            );
          }
        }
      }
    });
  }

  async updateStatus(
    id: number,
    dataUpdateStatus: UpdateStatusDto,
    req: RequestWithUser,
    Headers,
  ) {
    const lang = Headers.lang;
    const { statusId } = dataUpdateStatus;
    const userId = Number(req.user.userId);
    const [deal, status] = await Promise.all([
      await this.dealRepository.findOne({
        where: { id },
        relations: {
          status: true,
        },
      }),
      await this.statusRepository.findOne({
        where: {
          id: statusId,
        },
      }),
    ]);

    if (!deal || !status) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', { lang: lang }),
      );
    }

    if (Number(deal['status']?.id) != Number(status['id'])) {
      await this.dealRepository.update(id, {
        status,
      });

      if (status) {
        const newLog: any = {
          object: LogNoteObject.DEAL,
          objectId: Number(id),
          action: LogNoteActions.CHANGE_STATUS,
          oldValue: JSON.stringify(deal['status']?.name) ?? '',
          newValue: JSON.stringify(status['name']) ?? '',
          user: userId,
        };
        await this.logNoteRepository.save(newLog);
      }
    }
    return {
      data: {
        status,
      },
    };
  }

  async remove(id: number, Headers) {
    const lang = Headers.lang;
    const deal = await this.dealRepository.findOne({
      where: { id },
      relations: {
        orders: true,
        tasks: true,
      },
    });

    if (!deal) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', { lang: lang }),
      );
    }
    if (
      checkExistNestedData(deal.orders) ||
      checkExistNestedData(deal?.tasks)
    ) {
      throw new BadRequestException(
        this.i18n.t('message.status_messages.existed_relation_data', {
          lang: lang,
        }),
      );
    }

    await this.dealRepository.softDelete(id);
    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }

  private async checkTag(tagRequest: string): Promise<boolean> {
    const tags = await this.tagRepository
      .createQueryBuilder('tags')
      .select('tags.id')
      .getMany();

    const tagsId = tags.map((item) => {
      return item.id;
    });

    return tagRequest.split(',').every((item) => {
      return tagsId.includes(+item);
    });
  }

  private async getCurrencyValue(status: number): Promise<string> {
    const data = await this.currencyRepository.findOne({
      where: { id: status },
    });

    return data?.name;
  }

  private async getUserValue(id: number) {
    const data = await this.userRepository.findOne({
      where: { id: id },
      relations: {
        profile: true,
      },
    });

    return data?.profile?.first_name + data?.profile?.last_name;
  }
}
