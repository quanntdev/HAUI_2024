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
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Checklist)
    private readonly checkListRepository: Repository<Checklist>,
    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,
  ) {}
  async create(
    createChecklistDto: CreateChecklistDto,
    req: RequestWithUser,
    ) {
    const { taskId, title } = createChecklistDto;

    try {
      if (!(await checkExistInRepo(taskId, this.taskRepository))) {
        throw new NotFoundException('CAN NOT FOUND TASK ID');
      }
      const createCheckListData: any = {
        title,
        task: taskId,
      };

      const newCheckList = await this.checkListRepository.save({
        ...createCheckListData,
      });

      const newLog: any = {
        object: LogNoteObject.TASK,
        objectId: Number(taskId),
        action: LogNoteActions.CREATE_CHECKLIST,
        oldValue: null,
        newValue:
          JSON.stringify(JSON.stringify(title)) ?? '',
        user: Number(req.user.userId),
      };
      await this.logNoteRepository.save(newLog);
      return {
        data: newCheckList,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(id: number, updateChecklistDto: UpdateChecklistDto) {
    const { ...restData } = updateChecklistDto;
    const updateData: any = restData;

    delete updateData?.lang
    try {
      const checkList = await this.checkListRepository.findOne({
        where: { id },
      });
      if (!checkList) {
        throw new NotFoundException('CAN NOT FOUND CHECK LIST');
      }

      await this.checkListRepository.update(id, {
        ...checkList,
        ...updateData,
      });
      return {
        data: { ...checkList, ...updateData },
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async remove(id: number) {
    try {
      const checkList = await this.checkListRepository.findOne({
        where: { id: id },
      });
      if (!checkList) {
        throw new NotFoundException('CAN NOT FOUND CHECK LIST');
      }

      await this.checkListRepository.delete(id);
      return {
        data: [],
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
