import { TasksArchiveEnum } from './enum/tasks-archive.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Customer,
  Deal,
  Invoice,
  LogNote,
  Order,
  Tag,
  Task,
  User,
  Notification,
} from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import {
  PaginationQuery,
  PaginationQueryTask,
  PaginationQueryTaskByObjectId,
  PaginationResponse,
} from 'src/common/dtos';
import { Brackets, IsNull, Not, Repository, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { PriorityEnum } from './enum/priority.enum';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import {
  DEFAULT_IS_ARCHIVED_ID_TASK,
  DEFAULT_LIMIT_PAGINATE,
  DEFAULT_STATUS_ID_TASK,
  ROLE,
  ROLE_NAME,
} from 'src/constants';
import { RequestWithUser } from 'src/common/interfaces';
import { UpdateTaskDto } from './dto/update-task.dto';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { TasksStatusEnum } from './enum/tasks-status.enum';
import { TasksPublicEnum } from './enum/task-public.enum';
import {
  notificationAction,
  notificationSeenAction,
} from '../notifications/enum/notifications.enum';
import { NotificationSave } from 'src/common/utils/saveNotifications';
import { isArray } from 'class-validator';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { renderFilename } from 'src/common/utils/renderFilename';
import { Cron, CronExpression } from '@nestjs/schedule';
const moment = require('moment');
import config from 'src/config';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    req: RequestWithUser,
    Headers: any,
    attachment: any = null,
  ) {
    const lang = Headers.lang;
    const createdUserId = req.user.userId;
    const {
      dealId,
      usersId,
      orderId,
      invoiceId,
      customerId,
      ...restCreateTasks
    } = createTaskDto;
    let createTask: any = { ...restCreateTasks };
    const userIds = [];
    try {
      createTask = await this.handleDataCreateTask(
        createTask,
        dealId,
        this.dealRepository,
        'deal',
      );
      createTask = await this.handleDataCreateTask(
        createTask,
        orderId,
        this.orderRepository,
        'order',
      );
      createTask = await this.handleDataCreateTask(
        createTask,
        invoiceId,
        this.invoiceRepository,
        'invoice',
      );
      createTask = await this.handleDataCreateTask(
        createTask,
        customerId,
        this.customerRepository,
        'customer',
      );

      if (createdUserId) {
        if (await checkExistInRepo(+createdUserId, this.userRepository)) {
          if (isArray(createTask)) {
            createTask?.forEach((obj) => {
              obj.createdByUser = +createdUserId;
            });
          } else {
            createTask.createdByUser = +createdUserId;
          }
        } else {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.can_not_found_model', {
              lang: lang,
              args: {
                name: 'createdByUser',
              },
            }),
          );
        }
      }

      if (usersId) {
        if (await this.checkUsers(usersId)) {
          usersId?.split(',')?.forEach((value) => {
            const userObj = new User();
            userObj.id = +value;
            userIds.push(userObj);
          });
          if (isArray(createTask)) {
            createTask.forEach((obj) => {
              obj.users = userIds;
            });
          } else {
            createTask.users = userIds;
          }
        } else {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.not_found_user', {
              lang: lang,
            }),
          );
        }
      }
      if (isArray(createTask)) {
        createTask.forEach((obj) => {
          obj.statusId = DEFAULT_STATUS_ID_TASK;
          obj.isArchived = DEFAULT_IS_ARCHIVED_ID_TASK;
        });
      } else {
        createTask.statusId = DEFAULT_STATUS_ID_TASK;
        createTask.isArchived = DEFAULT_IS_ARCHIVED_ID_TASK;
      }

      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = attachment.filter(
          (items: any) => !items.mimetype.startsWith('image/'),
        );
        if (isArray(createTask)) {
          createTask.forEach(async (obj) => {
            obj.description = await this.attendDescription(
              imageAttach,
              fileAttach,
              createTaskDto.description,
            );
          });
        } else {
          createTask.description = await this.attendDescription(
            imageAttach,
            fileAttach,
            createTaskDto.description,
          );
        }
      }

      const task = await this.taskRepository.save(createTask);
      const taskAr = isArray(task) ? task : [task];
      const taskIds = isArray(taskAr)
        ? taskAr.map((item: any) => item.id)
        : taskAr;
      if (taskAr.length > 0) {
        const listLognote: any[] = [];

        taskIds.forEach((item: any) => {
          const newLog: any = {
            object: LogNoteObject.TASK,
            objectId: Number(item),
            action: LogNoteActions.CREATE,
            user: +createdUserId,
          };

          listLognote.push(newLog);
        });

        if (attachment) {
          taskIds.forEach((item: any) => {
            attachment.forEach((itemAtt: any) => {
              const logNote: any = {
                object: LogNoteObject.TASK,
                objectId: Number(item),
                action: itemAtt?.mimetype.startsWith('image/')
                  ? LogNoteActions.UPLOAD_FILE
                  : LogNoteActions.UPLOAD_FILE_RAW,
                user: +createdUserId,
                attachment: itemAtt?.filename,
              };
              listLognote.push(logNote);
            });
          });
        }

        const lognote = await this.logNoteRepository.save(listLognote);

        if (usersId) {
          const notificationSave: any[] = [];
          const lognoteIds = lognote.map((item: any) => item.id);

          usersId.split(',').forEach((item: any) => {
            lognoteIds.forEach((log: any) => {
              if (Number(item) !== Number(createdUserId)) {
                const obj = {
                  action: notificationAction.ASSIGNED,
                  logNote: Number(log),
                  seen: notificationSeenAction.NOT_SEEN,
                  user: Number(item),
                };
                notificationSave.push(obj);
              }
            });
          });

          await this.notificationRepository.save(notificationSave);
        }
      }
      return {
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
        data: task,
      };
    } catch (e) {
      throw e;
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

  private async checkInRepo(data: string, repo: any) {
    const dataId = await repo
      .createQueryBuilder('data')
      .select('data.id')
      .getMany();

    const usersIdFormatted = dataId.map((item) => item.id + '');
    return data.split(',').every((value) => {
      return usersIdFormatted.includes(value);
    });
  }

  async findAll(pagination: PaginationQueryTask, req: RequestWithUser) {
    try {
      let {
        offset = 0,
        limit = 0,
        keyword,
        archived = false,
        mytask = false,
        userAssign,
        statusId,
        typeSort = 'ASC',
        sortBy = 'dueDate',
        filterStartDate,
        filterDueDate,
        taskName,
        startTime,
        endTime,
        newClient,
      } = pagination;

      if (typeof archived === 'string') {
        archived = this.switchStringToBoolean(archived);
      }
      if (typeof mytask === 'string') {
        mytask = this.switchStringToBoolean(mytask);
      }
      if (userAssign) {
        mytask = false;
      }

      const userId = Number(req.user.userId);
      const kind = req.user.kind;
      const isLoggedInUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!isLoggedInUser) {
        throw new BadRequestException('NOT AUTHORIZED');
      }
      const query = this.createQuerySearch(offset, limit);

      if (archived) {
        query.andWhere(
          new Brackets((q) => {
            q.where('tasks.isArchived = :isArchived', {
              isArchived: archived,
            });
          }),
        );
      } else {
        query.andWhere(
          new Brackets((q) => {
            q.where('tasks.isArchived = :isArchived', {
              isArchived: false,
            });
          }),
        );
      }

      if (isLoggedInUser.role != ROLE.ADMIN && !mytask) {
        this.setNotUserAdminQuery(query, userId);
      }

      if (kind === ROLE_NAME.SALE_ASSISTANT) {
        userAssign = userId;
      }

      if (userAssign) {
        const queryTaskUserAssign = await this.taskRepository.find({
          where: {
            users: {
              id: userAssign,
            },
          },
        });

        let listIdTaskUserAssign = [];

        queryTaskUserAssign.forEach(function (value) {
          listIdTaskUserAssign.push(Number(value?.id));
        });

        query.andWhere(
          new Brackets((q) => {
            q.where(
              listIdTaskUserAssign?.length > 0
                ? 'tasks.id IN(:listIdTaskUserAssign)'
                : '',
              {
                listIdTaskUserAssign: listIdTaskUserAssign,
              },
            ).orWhere('users.id = :userId', {
              userId: userAssign,
            });
          }),
        );
      }

      if (mytask) {
        const queryMyTask = await this.taskRepository.find({
          where: {
            users: {
              id: userId,
            },
          },
        });

        let listIdTask = [];

        queryMyTask.forEach(function (value) {
          listIdTask.push(Number(value?.id));
        });

        query
          .andWhere(
            new Brackets((q) => {
              q.where(
                listIdTask?.length > 0 ? 'tasks.id IN(:listIdTask)' : '',
                {
                  listIdTask: listIdTask,
                },
              ).orWhere('createdByUserUser.id = :userId', {
                userId: userId,
              });
            }),
          )
          .andWhere(
            new Brackets((q) => {
              q.where('tasks.isArchived = :isArchived', {
                isArchived: false,
              });
            }),
          );
      }
      if (statusId && statusId != TasksStatusEnum.All) {
        query.andWhere(
          new Brackets((q) => {
            q.where('tasks.statusId = :statusId', {
              statusId: statusId,
            });
          }),
        );
      }
      if (keyword) {
        let newKey = keyword.split(' ').join('');
        query.andWhere(
          new Brackets((q) => {
            q.where('TRIM(REPLACE(tasks.name, " ", "")) LIKE :keyword', {
              keyword: `%${newKey}%`,
            });
          }),
        );
      }

      if (taskName) {
        let newKey = taskName.split(' ').join('');
        query.andWhere(
          new Brackets((q) => {
            q.where('TRIM(REPLACE(tasks.name, " ", "")) LIKE :keyword', {
              keyword: `%${newKey}%`,
            });
          }),
        );
      }

      if (!statusId && (!newClient || newClient !== 'true')) {
        query.andWhere(
          new Brackets((q) => {
            q.where('tasks.statusId != :statusId', {
              statusId: TasksStatusEnum.Done,
            });
          }),
        );
      }

      if (filterStartDate > filterDueDate) {
        throw new NotFoundException('ERROR DATE');
      } else {
        if (filterStartDate) {
          let startOfDay = moment(filterStartDate).format('YYYY-MM-DD 00:00');
          let endOfDay = moment(filterStartDate).format('YYYY-MM-DD 23:59');

          query.andWhere(
            new Brackets((q) => {
              q.where(
                'tasks.startDate >= :startOfDay AND tasks.startDate <=:endOfDay',
                { startOfDay: startOfDay, endOfDay: endOfDay },
              );
            }),
          );
        }

        if (filterDueDate) {
          let startOfDay = moment(filterDueDate).format('YYYY-MM-DD 00:00');
          let endOfDay = moment(filterDueDate).format('YYYY-MM-DD 23:59');

          query.andWhere(
            new Brackets((q) => {
              q.where(
                'tasks.dueDate >= :startOfDay AND tasks.dueDate <=:endOfDay',
                { startOfDay: startOfDay, endOfDay: endOfDay },
              );
            }),
          );
        }
      }

      if (startTime) {
        query.andWhere(
          new Brackets((q) => {
            q.where('tasks.startDate >= :startTime', {
              startTime: new Date(startTime),
            });
          }),
        );
      }

      if (endTime) {
        query.andWhere(
          new Brackets((q) => {
            q.where('tasks.dueDate <= :endTime', {
              endTime: new Date(endTime),
            });
          }),
        );
      }

      let [tasks, count] = await query.getManyAndCount();

      tasks = tasks.map((item) => {
        return {
          ...item,
          priorityName: this.getPriorityName(Number(item.priorityId)),
        };
      });

      const newData: any = this.sortDataByDueDate(
        tasks,
        typeSort,
        sortBy,
        limit,
        offset,
      );

      return {
        data: new PaginationResponse<any>(newData, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async totalUserAssign(req: RequestWithUser) {
    try {
      const isLoggedInUser = await this.userRepository.findOne({
        where: { id: +req.user.userId },
      });
      if (!isLoggedInUser) {
        throw new BadRequestException('NOT AUTHORIZED');
      }

      const query = this.createQuerySearch();
      const [tasks] = await query.getManyAndCount();

      const totalCount = tasks.reduce((count, taskItem) => {
        const userCount = taskItem.users.reduce((userTotalCount, userItem) => {
          if (userItem.id == +req.user.userId && taskItem.statusId !== 3) {
            return userTotalCount + 1;
          }
          return userTotalCount;
        }, 0);

        return count + userCount;
      }, 0);

      return {
        data: totalCount,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  sortDataByDueDate(
    data: any,
    typeSort: any,
    sortBy: any,
    limit: number,
    offset: number,
  ) {
    const dataTasksNew = data.filter(function (e: any) {
      return e[sortBy] != null;
    });

    const dataTaskNull = data.filter(function (e: any) {
      return e[sortBy] == null;
    });

    dataTasksNew.sort(function (a: any, b: any) {
      return typeSort == 'ASC'
        ? Math.abs(a[sortBy]) - Math.abs(b[sortBy])
        : Math.abs(b[sortBy]) - Math.abs(a[sortBy]);
    });

    const newDataTask = [...dataTasksNew, ...dataTaskNull];
    if (limit > 0) {
      const endIndex = Number(offset) + Number(limit);
      const limitedDataTask = newDataTask.slice(offset, endIndex);
      return limitedDataTask;
    }
    return newDataTask;
  }

  async findByObjectId(
    pagination: PaginationQueryTaskByObjectId,
    req: RequestWithUser,
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      let {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        customerId,
        orderId,
        dealId,
        invoiceId,
      } = pagination;
      const userId = Number(req.user.userId);
      let id: number;
      const isLoggedInUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!isLoggedInUser) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', {
            lang: lang,
          }),
        );
      }
      const query = this.createQuerySearch(offset, limit);

      query.andWhere(
        new Brackets((q) => {
          q.where('tasks.is_archived = :isArchived', {
            isArchived: false,
          });
        }),
      );

      if (orderId) {
        id = orderId;
        query.leftJoinAndSelect('tasks.order', 'orders').andWhere(
          new Brackets((q) => {
            q.where('tasks.order_id = :orderId', { orderId: id });
          }),
        );
      }

      if (customerId) {
        id = customerId;
        query.leftJoinAndSelect('tasks.customer', 'customers').andWhere(
          new Brackets((q) => {
            q.where('tasks.customer_id = :customerId', {
              customerId: id,
            });
          }),
        );
      }

      if (dealId) {
        id = dealId;
        query.leftJoinAndSelect('tasks.deal', 'deals').andWhere(
          new Brackets((q) => {
            q.where('tasks.deal_id = :dealId', { dealId: id });
          }),
        );
      }

      if (invoiceId) {
        id = invoiceId;
        query.leftJoinAndSelect('tasks.invoice', 'invoices').andWhere(
          new Brackets((q) => {
            q.where('tasks.invoice_id = :invoiceId', { invoiceId: id });
          }),
        );
      }

      if (isLoggedInUser.role != ROLE.ADMIN) {
        this.setNotUserAdminQuery(query, userId);
      }

      let [tasks, count] = await query.getManyAndCount();
      tasks = tasks.map((item) => {
        return {
          ...item,
          priorityName: this.getPriorityName(Number(item.priorityId)),
        };
      });

      return {
        data: new PaginationResponse<any>(tasks, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async updateTask(
    id: number,
    req: RequestWithUser,
    updateTaskDto: UpdateTaskDto,
    Headers: any,
  ) {
    const { usersId, ...restData } = updateTaskDto;
    const newUserIDList = [];
    const userId = Number(req.user.userId);
    const isLoggedInUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    try {
      const lang = Headers.lang;
      if (!isLoggedInUser) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', {
            lang: lang,
          }),
        );
      }
      let task: any = await this.taskRepository.findOne({
        where: { id },
        relations: { users: true, createdByUser: true },
      });

      const defautUserAssign: number = task.users.length;

      if (!task) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.can_not_found_task', {
            lang: lang,
          }),
        );
      }

      const updateTaskData: any = restData;

      let defautUser = [];

      task?.users.forEach(function (value) {
        defautUser.push(value?.id);
      });

      if (usersId) {
        let filteredArr: any = usersId.split(',').filter(function (item) {
          return !defautUser.includes(item);
        });

        if (task.users.length == 0) {
          const newAsignUser = await this.findUserNameById(filteredArr);
          if (await this.checkUsers(usersId)) {
            usersId.split(',').forEach((value) => {
              const userObj = new User();
              userObj.id = +value;
              newUserIDList.push(userObj);
            });
            task.users = newUserIDList;

            if (!defautUser.includes(usersId)) {
              const newLog: any = {
                object: LogNoteObject.TASK,
                objectId: Number(task?.id),
                action: LogNoteActions.USER_ASIGN,
                oldValue: null,
                newValue: JSON.stringify(newAsignUser) ?? '',
                user: userId,
              };
              const lognote = await this.logNoteRepository.save(newLog);
              if (Number(filteredArr) !== Number(userId)) {
                NotificationSave(
                  this.notificationRepository,
                  notificationAction.ASSIGNED,
                  lognote.id,
                  notificationSeenAction.NOT_SEEN,
                  Number(filteredArr),
                );
              }
            }
          } else {
            throw new NotFoundException(
              this.i18n.t('message.status_messages.not_found_user', {
                lang: lang,
              }),
            );
          }
        }

        const userLeftTask = defautUser.filter(function (item) {
          return !usersId.split(',').includes(item);
        });

        const userJoinTask: any = usersId.split(',');

        if (task.users.length > 0) {
          const usersList = task.users.map((user) => user.id).join();
          if (usersList !== usersId) {
            if (await this.checkUsers(usersId)) {
              await this.taskRepository.save({
                ...task,
                users: null,
              });
              usersId.split(',').forEach((value) => {
                const userObj = new User();
                userObj.id = +value;
                newUserIDList.push(userObj);
              });

              task.users = newUserIDList;

              const newLog: any = {
                object: LogNoteObject.TASK,
                objectId: Number(task?.id),
                action:
                  defautUserAssign < task.users.length
                    ? LogNoteActions.USER_ASIGN
                    : LogNoteActions.USER_LEFT_TASK,
                oldValue: null,
                newValue:
                  defautUserAssign > task.users.length
                    ? JSON.stringify(
                        await this.findUserNameById(userLeftTask[0]),
                      ) ?? ''
                    : JSON.stringify(
                        await this.findUserNameById(
                          userJoinTask[userJoinTask.length - 1],
                        ),
                      ) ?? '',
                user: userId,
              };

              const lognote = await this.logNoteRepository.save(newLog);

              if (
                defautUserAssign > task.users.length
                  ? Number(userLeftTask[0]) !== Number(userId)
                  : Number(userJoinTask[userJoinTask.length - 1]) !==
                    Number(userId)
              )
                NotificationSave(
                  this.notificationRepository,
                  defautUserAssign > task.users.length
                    ? notificationAction.LEFT
                    : notificationAction.ASSIGNED,
                  lognote.id,
                  notificationSeenAction.NOT_SEEN,
                  Number(
                    defautUserAssign > task.users.length
                      ? userLeftTask[0]
                      : userJoinTask[userJoinTask.length - 1],
                  ),
                );
            } else {
              throw new NotFoundException(
                this.i18n.t(
                  'message.status_messages.can_not_found_all_users_in_model',
                  {
                    lang: lang,
                  },
                ),
              );
            }
          }
        }
      }

      if (usersId == '') {
        await this.taskRepository.save({
          ...task,
          users: null,
        });
        task.users = newUserIDList;
        const newLog: any = {
          object: LogNoteObject.TASK,
          objectId: Number(task?.id),
          action: LogNoteActions.USER_LEFT_TASK,
          oldValue: null,
          newValue:
            JSON.stringify(await this.findUserNameById(defautUser[0])) ?? '',
          user: userId,
        };
        const lognote = await this.logNoteRepository.save(newLog);
        if (Number(defautUser[0]) !== Number(userId)) {
          NotificationSave(
            this.notificationRepository,
            notificationAction.LEFT,
            lognote.id,
            notificationSeenAction.NOT_SEEN,
            Number(defautUser[0]),
          );
        }
      }

      const newTask = {
        ...task,
        ...updateTaskData,
      };

      const updatedTask = await this.taskRepository.save({
        ...newTask,
      });

      if (updatedTask) {
        let listUser = [];

        task?.users.forEach(function (value) {
          listUser.push(value?.id);
        });
        await this.createTaskLogNotes(task, newTask, +userId, listUser);
      }
      return {
        data: {
          newTask,
          priorityName: this.getPriorityName(Number(newTask.priorityId)),
        },
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findUserNameById(id: number) {
    const users: any = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        profile: true,
      },
    });
    return users?.profile?.first_name + ' ' + users?.profile?.last_name;
  }

  async createTaskLogNotes(
    before: any,
    after: any,
    userId: number,
    listUserAssign: any = null,
  ) {
    const compareList = [
      'name',
      'statusId',
      'dueDate',
      'isPublic',
      'startDate',
      'priorityId',
      'isArchived',
      'description',
    ];

    compareList.forEach(async (item: string) => {
      if (item == 'startDate' || item == 'dueDate') {
        before[item] = moment(before[item]).format('YYYY-MM-DD HH:mm');
        after[item] = moment(after[item]).format('YYYY-MM-DD HH:mm');
      }

      if (JSON.stringify(before[item]) != JSON.stringify(after[item])) {
        let action: number;

        switch (item) {
          case 'statusId':
            action = LogNoteActions.CHANGE_STATUS;
            break;
          case 'name':
            action = LogNoteActions.CHANGE_NAME;
            break;
          case 'dueDate':
            action = LogNoteActions.CHANGE_DUE_DATE;

            break;
          case 'isPublic':
            action = LogNoteActions.CHANGE_PUBLIC;
            break;
          case 'startDate':
            action = LogNoteActions.CHANGE_START_DATE;
            break;
          case 'priorityId':
            action = LogNoteActions.CHANGE_PRIORITY;
            break;
          case 'description':
            action = LogNoteActions.CHANGE_DESCRIPTION;
            break;
        }
        if (action === LogNoteActions.CHANGE_STATUS) {
          const newLog: any = {
            object: LogNoteObject.TASK,
            objectId: Number(before?.id),
            action,
            oldValue:
              JSON.stringify(this.getStatusName(Number(before[item]))) ?? '',
            newValue:
              JSON.stringify(this.getStatusName(Number(after[item]))) ?? '',
            user: userId,
          };
          const lognote = await this.logNoteRepository.save(newLog);
          if (listUserAssign) {
            const notifications: any = listUserAssign.map((key: any) => ({
              action: notificationAction.EDIT,
              logNote: lognote.id,
              seen: notificationSeenAction.NOT_SEEN,
              user: Number(key),
            }));

            return await this.notificationRepository.save(notifications);
          }
        }

        if (action === LogNoteActions.CHANGE_DESCRIPTION) {
          const newLog: any = {
            object: LogNoteObject.TASK,
            objectId: Number(before?.id),
            action,
            oldValue: JSON.stringify(before[item]),
            newValue: JSON.stringify(after[item]),
            user: userId,
          };
          return await this.logNoteRepository.save(newLog);
        }

        if (action === LogNoteActions.CHANGE_PRIORITY) {
          const newLog: any = {
            object: LogNoteObject.TASK,
            objectId: Number(before?.id),
            action,
            oldValue:
              JSON.stringify(this.getPriorityName(Number(before[item]))) ?? '',
            newValue:
              JSON.stringify(this.getPriorityName(Number(after[item]))) ?? '',
            user: userId,
          };
          const lognote = await this.logNoteRepository.save(newLog);
          if (listUserAssign) {
            const notifications: any = listUserAssign.map((key: any) => ({
              action: notificationAction.EDIT,
              logNote: lognote.id,
              seen: notificationSeenAction.NOT_SEEN,
              user: Number(key),
            }));

            return await this.notificationRepository.save(notifications);
          }
        }

        if (action === LogNoteActions.CHANGE_PUBLIC) {
          const newLog: any = {
            object: LogNoteObject.TASK,
            objectId: Number(before?.id),
            action,
            oldValue:
              JSON.stringify(this.getPulishOrNot(Number(before[item]))) ?? '',
            newValue:
              JSON.stringify(this.getPulishOrNot(Number(after[item]))) ?? '',
            user: userId,
          };
          const lognote = await this.logNoteRepository.save(newLog);
          if (listUserAssign) {
            const notifications: any = listUserAssign.map((key: any) => ({
              action: notificationAction.EDIT,
              logNote: lognote.id,
              seen: notificationSeenAction.NOT_SEEN,
              user: Number(key),
            }));

            return await this.notificationRepository.save(notifications);
          }
        }

        const newLog: any = {
          object: LogNoteObject.TASK,
          objectId: Number(before?.id),
          action,
          oldValue: JSON.stringify(before[item]) ?? '',
          newValue: JSON.stringify(after[item]) ?? '',
          user: userId,
        };
        const lognote = await this.logNoteRepository.save(newLog);
        if (listUserAssign) {
          const notifications: any = listUserAssign.map((key: any) => ({
            action: notificationAction.EDIT,
            logNote: lognote.id,
            seen: notificationSeenAction.NOT_SEEN,
            user: Number(key),
          }));

          await this.notificationRepository.save(notifications);
        }
      }
    });
  }

  async getTaskDetail(
    id: number,
    req: RequestWithUser,
    pagination: PaginationQuery,
    Headers: any,
  ) {
    const lang = Headers.lang;
    const userId = Number(req.user.userId);
    let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;

    try {
      const isLoggedInUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      const task = await this.taskRepository.findOne({
        where: { id },
        relations: {
          users: { profile: true },
          createdByUser: { profile: true },
          deal: true,
          customer: true,
          order: true,
          invoice: true,
          checklist: { item: true },
        },
      });

      if (!task) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.can_not_found_task', {
            lang: lang,
          }),
        );
      }
      if (
        !isLoggedInUser &&
        task.isPublic != true &&
        isLoggedInUser?.role != ROLE.ADMIN &&
        !task.users?.find((user: any) => user.id == isLoggedInUser?.id) &&
        task.createdByUser?.id != isLoggedInUser?.id
      ) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.can_not_access_this_task', {
            lang: lang,
          }),
        );
      }
      const response = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.TASK,
        offset,
        limit,
      );

      const fileTask = await this.logNoteRepository.find({
        where: {
          object: 'tasks',
          objectId: Number(id),
          attachment: Not(IsNull()),
        },
        order: {
          id: 'DESC',
        },
      });

      return {
        data: {
          task,
          priorityName: this.getPriorityName(Number(task.priorityId)),
          logNote: transformLogNote(response, lang, this.i18n),
          fileTask: fileTask,
        },
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async deleteTask(id: number, Headers: any) {
    const lang = Headers.lang;
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.can_not_found_task', {
          lang: lang,
        }),
      );
    }

    await this.taskRepository.delete(id);
    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }

  async archivedTask(id: number, req: RequestWithUser, Headers: any) {
    const lang = Headers.lang;
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.can_not_found_task', {
          lang: lang,
        }),
      );
    }

    task.isArchived = !task.isArchived;
    await this.taskRepository.update(id, {
      ...task,
    });

    const newLog: any = {
      object: LogNoteObject.TASK,
      objectId: Number(task?.id),
      action: LogNoteActions.CHANGE_ARCHIVE,
      oldValue: JSON.stringify(this.getArchive(Number(!task.isArchived))) ?? '',
      newValue: JSON.stringify(this.getArchive(Number(task.isArchived))) ?? '',
      user: Number(req.user.userId),
    };

    await this.logNoteRepository.save(newLog);

    return {
      data: {
        task,
        priorityName: this.getPriorityName(Number(task.priorityId)),
      },
      message: this.i18n.t('message.status_messages.update_success', {
        lang: lang,
      }),
    };
  }

  private async checkUsers(users: string) {
    const usersId = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id')
      .getMany();

    const usersIdFormatted = usersId.map((item) => item.id + '');
    return users.split(',').every((value) => {
      return usersIdFormatted.includes(value);
    });
  }

  private async handleDataCreateTask(createTask, id, repo, key) {
    if (id) {
      if (await this.checkInRepo(id, repo)) {
        const idArray = id.split(',');
        let newData = [];
        idArray.forEach((value) => {
          let datas = {
            ...createTask,
            [key]: Number(value),
          };
          newData.push(datas);
        });
        return newData;
      } else {
        throw new NotFoundException('Can not found ' + key + ' model');
      }
    }
    return createTask;
  }

  private getPriorityName(status: number): string {
    if (status === 0) {
      return PriorityEnum[1];
    } else {
      return PriorityEnum[status];
    }
  }

  private getStatusName(status: number): string {
    if (status === 0) {
      return TasksStatusEnum[1];
    } else {
      return TasksStatusEnum[status];
    }
  }

  private getPulishOrNot(value: number): string {
    if (value === 0) {
      return TasksPublicEnum[0];
    }
    return TasksPublicEnum[1];
  }

  private getArchive(value: number): string {
    if (value === 0) {
      return TasksArchiveEnum[0];
    }
    return TasksArchiveEnum[1];
  }

  private createQuerySearch(offset = 0, limit = DEFAULT_LIMIT_PAGINATE) {
    return this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.users', 'users')
      .leftJoinAndSelect('tasks.createdByUser', 'createdByUserUser')
      .leftJoinAndSelect('users.profile', 'profiles');
  }

  private setNotUserAdminQuery(query: any, userId: any) {
    query.andWhere(
      new Brackets((q) => {
        q.where('tasks.isPublic = :isPublic', {
          isPublic: true,
        })
          .orWhere(
            new Brackets((q) => {
              q.where('users.id = :userId', {
                userId: userId,
              });
            }),
          )
          .orWhere(
            new Brackets((q) => {
              q.where('createdByUserUser.id = :userId', {
                userId: userId,
              });
            }),
          );
      }),
    );
  }

  private switchStringToBoolean(value: string) {
    switch (value) {
      case 'false':
        return false;
      case 'true':
        return true;
      default:
        break;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'updateTaskNotifi',
    timeZone: config.TIME_ZONE ?? 'Asia/Ho_Chi_Minh',
  })
  async updateTaskNotifi(handlebyRequest: boolean) {
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const fromDate = new Date(dueDate.getTime() - 1 * 60 * 1000);
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'users')
      .where('task.dueDate > :fromDate', { fromDate })
      .andWhere('task.dueDate < :dueDate', { dueDate })
      .getMany();

    const taksIds = tasks.map((obj) => obj.id);

    const lognote = await this.logNoteRepository.find({
      where: {
        object: 'tasks',
        objectId: In(taksIds),
      },
      relations: {
        user: true,
      },
    });

    const result: any = tasks.flatMap((tasks) => {
      const lognoteItem = lognote.find(
        (noteItem) => noteItem.objectId == tasks.id,
      );

      if (lognoteItem) {
        return tasks.users.map((userItem) => ({
          action: notificationAction.DUEDATE_TASK,
          logNote: lognoteItem.id,
          seen: notificationSeenAction.NOT_SEEN,
          user: userItem.id,
        }));
      }
    });

    await this.notificationRepository.save(result);

    if (handlebyRequest) {
      return { data: [] };
    }
  }
}
