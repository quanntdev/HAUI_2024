import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { User } from './user.entity';
import { Deal } from './deal.entity';
import { Order } from './order.entity';

@Entity('categories')
export class Category {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.category_id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Deal, (deal) => deal.category)
  deals: Deal[];

  @OneToMany(() => Order, (order) => order.category)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
