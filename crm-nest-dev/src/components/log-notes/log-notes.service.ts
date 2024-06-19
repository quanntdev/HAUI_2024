import { Task } from './../../entities/task.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLogNoteDto } from './dto/create-log-note.dto';
import {
  LogNote,
  User,
  Notification,
  Customer,
  PartnerInvoice,
  PaymentPartner,
} from 'src/entities';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { RequestWithUser } from 'src/common/interfaces';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import {
  UploadFileDto,
  UploadFileRawDto,
} from './dto/upload-file-log-note.dto';
import { UpdateLogNoteDto } from './dto/update-log-note.dto';
import { LogNoteActions } from './enum/log-note-actions.enum';
import {
  ATTACHMENT_FORDER,
  ATTACHMENT_FORDER_FILE,
  DEFAULT_LIMIT_PAGINATE,
  ROLE_NAME,
} from 'src/constants';
import * as path from 'path';
import {
  notificationAction,
  notificationSeenAction,
} from '../notifications/enum/notifications.enum';
import { PaginationQueryLogNote } from 'src/common/dtos';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { NotificationSave } from 'src/common/utils/saveNotifications';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
const fs = require('fs');

@Injectable()
export class LogNotesService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,

    @InjectRepository(LogNote)
    private readonly logNotesRepository: Repository<LogNote>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async compleRepo(object: string) {
    switch (object) {
      case 'orders':
        return 'Order';
      case 'deals':
        return 'Deal';
      case 'customers':
        return 'Customer';
    }
  }

  async saveNoti(
    object: any,
    objectId: number,
    lognoteId: number,
    Repo: any,
    action: any,
    userId: any,
  ) {
    const repo = await this.compleRepo(object);

    if (repo) {
      const userAssign = await Repo.createQueryBuilder('log_notes')
        .leftJoin(repo, 'repo', 'repo.id = :objectId', {
          objectId: Number(objectId),
        })
        .select(['repo.userAssign'])
        .getRawOne();

      if (
        Object.values(userAssign)[0] &&
        Number(Object.values(userAssign)[0]) !== Number(userId)
      ) {
        NotificationSave(
          this.notificationRepository,
          action,
          lognoteId,
          notificationSeenAction.NOT_SEEN,
          Number(Object.values(userAssign)[0]),
        );
      }
    }

    if (object === 'tasks') {
      const userAssign2: any = await Repo.createQueryBuilder('log_notes')
        .leftJoin(Task, 'repo', 'repo.id = :objectId', {
          objectId: Number(objectId),
        })
        .leftJoinAndSelect('repo.users', 'users')
        .select(['users'])
        .getRawAndEntities();

      const users = userAssign2.raw.map(
        (userWithTask) => userWithTask.users_id,
      );

      const listUserAssign = Array.from(new Set(users));
      const notificationSave: any[] = [];
      if (listUserAssign.length > 0 && listUserAssign[0] !== null) {
        listUserAssign.forEach((item: any) => {
          if (Number(item) !== Number(userId)) {
            const obj = {
              action: action,
              logNote: lognoteId,
              seen: notificationSeenAction.NOT_SEEN,
              user: Number(item),
            };
            notificationSave.push(obj);
          }
        });
        await this.notificationRepository.save(notificationSave);
      }
    }
  }

  async create(createLogNoteDto: CreateLogNoteDto, req: RequestWithUser) {
    const userId = req.user.userId;
    const createLogData: any = createLogNoteDto;
    let setUpdate = 0;
    let userIds = [];

    try {
      const usersId = createLogNoteDto?.usersId;

      if (usersId) {
        if (!(await this.checkUsers(usersId)))
          throw new NotFoundException('Can not found all users in model');
      }

      if (
        !userId ||
        !(await checkExistInRepo(Number(userId), this.userRepository))
      ) {
        throw new BadRequestException();
      }
      if (createLogData.emoji) {
        const findLog: any = await this.logNotesRepository.find({
          where: {
            user: {
              id: Number(userId),
            },
            emoji: createLogData.emoji,
            notes: {
              id: createLogData.note_id,
            },
          },
          relations: {
            notes: {
              user: true,
            },
          },
        });

        if (findLog.length > 0) {
          await this.notificationRepository
            .createQueryBuilder()
            .delete()
            .from(Notification)
            .where('logNote = :logNote', { logNote: Number(findLog[0]?.id) })
            .execute();
          setUpdate = 1;

          await this.logNotesRepository.remove(findLog);
        }
      }
      let result: any;

      if (setUpdate == 0) {
        result = await this.logNotesRepository.save({
          ...createLogData,
          user: userId,
          notes: createLogData?.note_id,
        });

        if (!createLogData.emoji) {
          this.saveNoti(
            createLogData?.object,
            createLogData?.objectId,
            result.id,
            this.logNotesRepository,
            notificationAction.COMMENT_IN,
            userId,
          );

          if (usersId) {
            userIds = usersId.split(',');
            const notifications: any[] = [];

            userIds?.forEach((key: any) => {
              if (Number(key) !== Number(userId)) {
                const obj = {
                  action: notificationAction.MENTION,
                  logNote: result.id,
                  seen: notificationSeenAction.NOT_SEEN,
                  user: Number(key),
                };
                notifications.push(obj);
              }
            });

            await this.notificationRepository.save(notifications);
          }
        } else {
          const userDefault = await this.logNotesRepository.findOne({
            where: {
              id: Number(createLogData?.note_id),
            },
            relations: {
              user: true,
            },
          });

          if (Number(userDefault?.user?.id) !== Number(userId)) {
            const dataSave: any = {
              action: notificationAction.REACTION,
              logNote: result.id,
              seen: notificationSeenAction.NOT_SEEN,
              user: Number(userDefault.user?.id),
            };
            await this.notificationRepository.save(dataSave);
          }
        }
      }

      return {
        data: result,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  private async checkUsers(users: string) {
    const usersId = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id')
      .getMany();

    const usersIdFormatted = usersId.map((item) => item.id + '');
    return users.split(', ').every((value) => {
      return usersIdFormatted.includes(value);
    });
  }

  async uploadFile(
    uploadFileDto: UploadFileDto,
    req: RequestWithUser,
    attachment: Express.Multer.File,
  ) {
    try {
      const userId = Number(req?.user?.userId);
      const logNote: any = {
        ...uploadFileDto,
        attachment: attachment,
        user: userId,
      };

      const dataUpdate = await this.logNotesRepository.save(logNote);

      this.saveNoti(
        uploadFileDto?.object,
        uploadFileDto?.objectId,
        dataUpdate.id,
        this.logNotesRepository,
        notificationAction.ATTACH_IMAGE,
        userId,
      );

      return {
        data: {
          dataUpdate,
        },
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async uploadFileRaw(
    uploadFileDto: UploadFileRawDto,
    req: RequestWithUser,
    attachment: Express.Multer.File,
  ) {
    try {
      const userId = Number(req?.user?.userId);
      const logNote: any = {
        ...uploadFileDto,
        attachment: attachment?.filename,
        user: userId,
      };

      const dataUpdate = await this.logNotesRepository.save(logNote);
      this.saveNoti(
        uploadFileDto?.object,
        uploadFileDto?.objectId,
        dataUpdate.id,
        this.logNotesRepository,
        notificationAction.ATTACH_FILE,
        userId,
      );

      return {
        data: {
          dataUpdate,
        },
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async delete(id: number) {
    const data = await this.logNotesRepository.findOne({
      where: { id },
      relations: { note: true },
    });
    try {
      if (!data) {
        throw new NotFoundException('COMMENT NOT FOUND');
      }
      if (data?.note?.length <= 0) {
        if (data?.action === LogNoteActions.UPLOAD_FILE) {
          const filePath = path.join(`${ATTACHMENT_FORDER}/`, data.attachment);
          if (filePath) {
            await fs.unlink(filePath, (err: any) => console.log(err));
          }
        }

        if (data?.action === LogNoteActions.UPLOAD_FILE_RAW) {
          const filePath = path.join(
            `${ATTACHMENT_FORDER_FILE}/`,
            data.attachment,
          );
          if (filePath) {
            await fs.unlink(filePath, (err: any) => console.log(err));
          }
        }

        await this.notificationRepository.delete({ logNote: { id: id } });

        await this.logNotesRepository.delete(id);
      } else {
        await this.logNotesRepository.update(id, {
          isHide: true,
          comment: '',
        });
      }
      return { data: id };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    UpdateLogNoteDto: UpdateLogNoteDto,
    req: RequestWithUser,
  ) {
    try {
      const { comment } = UpdateLogNoteDto;
      const task = await this.logNotesRepository.findOne({
        where: { id },
        relations: { user: true },
      });
      if (!task) {
        throw new NotFoundException('CAN NOT FOUND THIS COMMENT');
      }
      await this.logNotesRepository.update(id, {
        ...task,
        comment,
        updated_at: new Date(),
      });

      return { data: comment };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAll(
    pagination: PaginationQueryLogNote,
    headers: any,
    req: RequestWithUser,
  ) {
    try {
      const lang = headers.lang;
      const kind = req.user.kind;
      const userId = Number(req.user.userId);
      const {
        findBy,
        limit = DEFAULT_LIMIT_PAGINATE,
        offset = 0,
        show,
      } = pagination;

      let find = null;
      let findExcept = null;

      if (findBy === 'comment') {
        find = LogNoteActions.COMMENT;
      } else if (findBy === 'activity') {
        findExcept = LogNoteActions.COMMENT;
      }
      const listLognoteIds = [
        LogNoteActions.CREATE_INVOICE,
        LogNoteActions.CREATE_PAYMENT,
        LogNoteActions.CREATE_ORDER,
        LogNoteActions.CREATE_DEAL,
        LogNoteActions.EDIT,
        LogNoteActions.CHANGE_GENDER,
        LogNoteActions.CREATE,
        LogNoteActions.CHANGE_STATUS,
        LogNoteActions.CHANGE_VALUE,
        LogNoteActions.CHANGE_DUE_DATE,
        LogNoteActions.CHANGE_NAME,
        LogNoteActions.CHANGE_START_DATE,
        LogNoteActions.CHANGE_CURENCY,
        LogNoteActions.CHANGE_DELIVERY_DATE,
        LogNoteActions.CREATE_ORDER_ITEM,
        LogNoteActions.DELETE_ORDER_ITEM,
        LogNoteActions.CHANGE_METHOD,
        LogNoteActions.CHANGE_INVOCE,
        LogNoteActions.CHANGE_AMOUNT,
        LogNoteActions.CHANGE_DATE,
        LogNoteActions.UPLOAD_FILE,
        LogNoteActions.UPLOAD_FILE_RAW,
        LogNoteActions.CHANGE_PUBLIC,
        LogNoteActions.CHANGE_PRIORITY,
        LogNoteActions.CHANGE_ARCHIVE,
        LogNoteActions.CREATE_CHECKLIST,
        LogNoteActions.USER_ASIGN,
        LogNoteActions.USER_LEFT_TASK,
        LogNoteActions.DONE_CHECKLIST_ITEM,
        LogNoteActions.LEFT_CHECKLIST_ITEM,
        LogNoteActions.REACTION,
        LogNoteActions.CHANGE_DESCRIPTION,
        LogNoteActions.CHANGE_PROVINCE,
        LogNoteActions.CHANGE_INVOICE_CUSTOMER_NAME,
        LogNoteActions.CHANGE_COUNTRY_NAME,
        LogNoteActions.CHANGE_GENDER,
        LogNoteActions.CHANGE_PHONE,
        LogNoteActions.CHANGE_EMAIL,
        LogNoteActions.CHANGE_CARD_VISIT,
        LogNoteActions.CREATE_PAYMENT_PARTNER,
        LogNoteActions.CHANGE_VAT,
      ];

      const response = await getLogNotes(
        this.logNotesRepository,
        null,
        null,
        offset,
        limit,
        find,
        findExcept,
        show,
        listLognoteIds,
      );

      const query = await this.queryAllLognote();

      const data = transformLogNote(response, lang, this.i18n);

      const result = data.items
        .filter((item) => {
          if (kind === ROLE_NAME.SALE_ASSISTANT) {
            return Number(item.createdUser.id) === userId;
          } else {
            return true;
          }
        })
        .map((item) => {
          const matchingQuery = query.find((q) => q.log_notes_id === item?.id);

          if (!matchingQuery) {
            return item;
          }

          const {
            customers_name,
            deals_name,
            orders_name,
            tasks_name,
            invoices_code,
            log_notes_object_id,
            deal_customer_name,
            customer_id,
            contacts_first_name,
            contacts_last_name,
            partnerInvoice_code,
            paymentPartner_id,
          } = matchingQuery;

          let name: any;
          if (
            typeof contacts_first_name === 'string' &&
            typeof contacts_last_name === 'string'
          ) {
            name = contacts_first_name + contacts_last_name;
          } else {
            name = ' ';
          }

          const lognote_title =
            customers_name ||
            deals_name ||
            orders_name ||
            tasks_name ||
            invoices_code ||
            partnerInvoice_code ||
            paymentPartner_id ||
            name;

          return {
            ...item,
            lognote_title,
            log_notes_object_id,
            deal_customer_name,
            customer_id,
          };
        });

      return {
        data: result,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async queryAllLognote() {
    const query = await this.logNotesRepository
      .createQueryBuilder('log_notes')
      .leftJoin(
        Customer,
        'customers',
        "log_notes.objectId = customers.id AND log_notes.object = 'customers'",
      )
      .leftJoin(
        PartnerInvoice,
        'partnerInvoice',
        "log_notes.objectId = partnerInvoice.id AND log_notes.object = 'invoice_partner'",
      )
      .leftJoin(
        PaymentPartner,
        'paymentPartner',
        "log_notes.objectId = paymentPartner.id AND log_notes.object = 'payment_partner'",
      )
      .leftJoin(
        'deals',
        'deals',
        "log_notes.objectId = deals.id AND log_notes.object = 'deals'",
      )
      .leftJoin(Customer, 'deal_customer', 'deal_customer.id = deals.customer')
      .leftJoin(
        'orders',
        'orders',
        "log_notes.objectId = orders.id AND log_notes.object = 'orders'",
      )
      .leftJoin(
        'tasks',
        'tasks',
        "log_notes.objectId = tasks.id AND log_notes.object = 'tasks'",
      )
      .leftJoin(
        'invoices',
        'invoices',
        "log_notes.objectId = invoices.id AND log_notes.object = 'invoices'",
      )
      .leftJoin(
        'contacts',
        'contacts',
        "log_notes.objectId = contacts.id AND log_notes.object = 'contacts'",
      )
      .where('log_notes.object_id is not null')
      .select([
        'log_notes.id',
        'log_notes.object',
        'log_notes.objectId',
        'customers.name',
        'deals.name',
        'deal_customer.name',
        'deals.customer',
        'tasks.name',
        'orders.name',
        'invoices.code',
        'contacts.firstName',
        'contacts.lastName',
        'partnerInvoice.code',
        'paymentPartner.id',
      ])
      .where('log_notes.objectId IS NOT NULL')
      .orderBy('log_notes_id', 'DESC')
      .getRawMany();

    return query;
  }
}
