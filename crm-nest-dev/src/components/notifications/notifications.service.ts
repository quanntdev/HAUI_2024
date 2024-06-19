import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { SUCCESS_CODES } from '../../constants/successCodes';
import { Tag } from '../../entities/tag.entity';
import { Industry } from '../../entities/industry.entity';
import { EmployeeConfig } from '../../entities/employeeConfig.entity';
import {
  PaginationQuery,
  PaginationResponse,
  PaginationResponseWithTotalData,
} from '../../common/dtos';
import { ERROR_CODES } from '../../constants/errorCodes';
import {
  LogNote,
  Notification,
} from 'src/entities';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { RequestWithUser } from 'src/common/interfaces';
import { notificationSeenAction } from './enum/notifications.enum';
import { transformNotification } from 'src/common/utils/tranformNotifications';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { LogNotesService } from '../log-notes/log-notes.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(LogNote)
    private readonly lognoteRepository: Repository<LogNote>,

    private lognoteService : LogNotesService,

    private i18n: I18nService<I18nTranslations>
  ) { }

  async findAll(
    req: RequestWithUser,
    Header
  ) {
    try {
      const userId = Number(req.user.userId);
      const lang = Header.lang

      const [notifications, totalNotSeen] = await Promise.all([
        this.notificationRepository.find({
          where: {
            user: {
              id: userId
            },
          },
          relations: {
            user: true,
            logNote: {
              user: { profile: true },
              notes: true
            },
          },
          order: {
            id: "DESC"
          }
        }),
        this.notificationRepository.count({
          where: {
            user: {
              id: userId
            },
            seen: Number(notificationSeenAction.NOT_SEEN)
          },
        })
      ])

      const lognoteQuery = await this.lognoteService.queryAllLognote();
      const notification = transformNotification(notifications, null, this.i18n, lang, lognoteQuery)
      return {
        data: notification,
        totalNotSeen: totalNotSeen
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async updateSeen(
    id: number,
    req: RequestWithUser,
  ) {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
        relations: {
          user: true
        }
      })

      if (notification) {
        if (notification.user.id == Number(req.user.userId)) {
          notification.seen = notificationSeenAction.SEEN
          await this.notificationRepository.update(id, {
            ...notification
          })
        } else {
          throw new BadRequestException(ERROR_CODES.UNAUTHORIZED)
        }
      } else {
        throw new BadRequestException(ERROR_CODES.DATA_NOT_FOUND)
      }

      return {
        data: notification,
        message: SUCCESS_CODES.UPDATE_SUCCESSFULLY,
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async updateSeenAll(
    req: RequestWithUser,
  ) {
    const userId = Number(req.user.userId)
    try {
      await this.notificationRepository.createQueryBuilder('notifi')
        .update(Notification)
        .set({ seen: notificationSeenAction.SEEN })
        .where("user = :userId", { userId })
        .execute();
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
