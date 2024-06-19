import {
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Checklist } from './checklist.entity';
import { ColumnString } from './columns';

@Entity('checklist_items')
export class ChecklistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnString()
  title: string;

  @Column({ type: 'boolean', default: 0, name: 'is_done' })
  isDone: boolean;

  @ManyToOne(() => Checklist, (checklist) => checklist.item, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checklist_id' })
  checklist: Checklist;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
