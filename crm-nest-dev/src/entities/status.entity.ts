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
import { ColumnBoolean, ColumnPrimaryKeyInt, ColumnString } from './columns';
import { User } from './user.entity';
import { Deal } from './deal.entity';

@Entity('statuses')
export class Status {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @Column({ name: 'color_code', nullable: true })
  colorCode: string;

  @Column({ name: 'is_default', type: 'boolean', nullable: true })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.statuses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Deal, (deal) => deal.status)
  deals: Deal[];
}
