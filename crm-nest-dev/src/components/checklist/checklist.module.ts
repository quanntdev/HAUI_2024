import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { ChecklistItem } from 'src/entities/checklist-item.entity';
import { Checklist } from 'src/entities/checklist.entity';
import { ChecklistItemService } from '../checklist-item/checklist-item.service';
import { LogNote } from 'src/entities/log-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, ChecklistItem, Checklist, LogNote])],
  controllers: [ChecklistController],
  providers: [ChecklistService, ChecklistItemService],
})
export class ChecklistModule {}
