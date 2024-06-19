import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString, ColumnTinyInt } from './columns';

import { User } from './user.entity';
import { Notification } from './notification.entity';

@Entity('log_notes')
export class LogNote {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  object: string;

  @Column({ name: 'object_id', nullable: true })
  objectId: number;

  @ColumnTinyInt()
  action: number;

  @Column('text', { nullable: true, name: 'old_value' })
  oldValue: string;

  @Column('text', { nullable: true, name: 'new_value' })
  newValue: string;

  @Column('text', { nullable: true })
  comment: string;

  @ColumnString()
  attachment: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => LogNote, (item) => item.notes)
  @JoinColumn()
  note: LogNote[];

  @ManyToOne(() => LogNote, ((item) => item.note), {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'note_id' })
  notes: LogNote;

  @OneToMany(() => Notification, ((noti) => noti.logNote), {onDelete: 'CASCADE'})
  notifications: Notification[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column('text', { nullable: true })
  emoji: string;

  @Column({ name: 'is_hide', nullable: true})
  isHide: boolean;
}
