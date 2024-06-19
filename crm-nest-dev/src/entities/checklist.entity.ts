import {
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ColumnString } from './columns';
import { Task } from './task.entity';

@Entity('checklist')
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnString()
  title: string;

  @Column({ type: 'boolean', default: 0, name: 'is_done' })
  isDone: boolean;

  @ManyToOne(() => Task, (task) => task.checklist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @OneToMany(() => ChecklistItem, (item) => item.checklist)
  item: ChecklistItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
