import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  Customer,
  Deal,
  Invoice,
  LogNote,
  Order,
  Task,
  User,
  Notification
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { Checklist } from 'src/entities/checklist.entity';
import { ChecklistItem } from 'src/entities/checklist-item.entity';
import { ChecklistService } from '../checklist/checklist.service';
import { ChecklistItemService } from '../checklist-item/checklist-item.service';
import { CheckDateGreaterStartDate } from 'src/common/validatorContraints/checkDateGreaterStartDate';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Deal,
      Order,
      Customer,
      Invoice,
      User,
      Checklist,
      ChecklistItem,
      LogNote,
      Notification
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, ChecklistService, ChecklistItemService,CheckDateGreaterStartDate],
})
export class TasksModule {}
