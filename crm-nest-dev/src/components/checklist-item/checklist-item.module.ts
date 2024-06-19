import { Module } from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { ChecklistItemController } from './checklist-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { ChecklistItem } from 'src/entities/checklist-item.entity';
import { Checklist } from 'src/entities/checklist.entity';
import { ChecklistService } from '../checklist/checklist.service';
import { LogNote } from 'src/entities/log-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist, ChecklistItem, Task, LogNote])],
  controllers: [ChecklistItemController],
  providers: [ChecklistItemService, ChecklistService],
})
export class ChecklistItemModule {}
