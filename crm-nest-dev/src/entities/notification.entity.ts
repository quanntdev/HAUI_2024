import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { ColumnDate, ColumnPrimaryKeyInt, ColumnString, ColumnTinyInt } from './columns';
import { User } from './user.entity';
import { LogNote } from './log-note.entity';

@Entity('notifications')
export class Notification {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnTinyInt()
  action: number;

  @ColumnTinyInt()
  seen: number;

  @ManyToOne(() => User, (users) => users.notifications)
  @JoinColumn({ name: 'to_user' })
  user: User;

  @ManyToOne(() => LogNote, (logs) => logs.notifications, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'logNote_id' })
  logNote: LogNote;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
