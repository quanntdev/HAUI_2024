import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithUser } from 'src/common/interfaces';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { LogNote, Task } from 'src/entities';
import { ChecklistItem } from 'src/entities/checklist-item.entity';
import { Checklist } from 'src/entities/checklist.entity';
import { Repository } from 'typeorm';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { checkListItemEnum } from './enum/checklist.enum';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checkListRepository: Repository<Checklist>,
    @InjectRepository(ChecklistItem)
    private readonly checkListItemRepository: Repository<ChecklistItem>,
    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,
  ) {}
  async create(createChecklistDto: CreateChecklistItemDto) {
    const { checklistId, title } = createChecklistDto;
    try {
      if (!(await checkExistInRepo(checklistId, this.checkListRepository))) {
        throw new NotFoundException('CAN NOT FOUND CHECK LIST');
      }
      const newCheckListItemData: any = {
        title,
        checklist: checklistId,
      };
      const newCheckListItem = await this.checkListItemRepository.save(
        newCheckListItemData,
      );

      return {
        data: newCheckListItem,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    updateChecklistItemDto: UpdateChecklistItemDto,
    req: RequestWithUser,
  ) {
    const { ...restData } = updateChecklistItemDto;
    const updateData: any = restData;

    delete updateData.lang

    try {
      const checkListItem = await this.checkListItemRepository.findOne({
        where: { id },
        relations : {
          checklist: {
            task: true
          }
        }
      });

      if (!checkListItem) {
        throw new NotFoundException('CAN NOT FOUND CHECK LIST');
      }

      await this.checkListItemRepository.update(id, {
        ...checkListItem,
        ...updateData,
      });
      let action:any;
      if(restData.isDone == checkListItemEnum.DONE) {
        action = LogNoteActions.DONE_CHECKLIST_ITEM
        const newLog: any = {
          object: LogNoteObject.TASK,
          objectId: Number(checkListItem.checklist.task.id),
          action: action,
          oldValue: String(id),
          newValue:
            JSON.stringify(restData.title) ?? '',
          user: Number(req.user.userId),
        };
        await this.logNoteRepository.save(newLog);
      } else {
        await this.logNoteRepository.delete({oldValue: String(id)})
      }

      return {
        data: { ...checkListItem, ...updateData },
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async remove(id: number) {
    try {
      const checkListItem = await this.checkListItemRepository.findOne({
        where: { id: id },
      });
      if (!checkListItem) {
        throw new NotFoundException('CAN NOT FOUND CHECK LIST');
      }

      await this.checkListItemRepository.delete(id);
      return {
        data: [],
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
