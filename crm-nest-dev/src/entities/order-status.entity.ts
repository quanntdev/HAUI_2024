import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnBoolean, ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_statuses')
export class OrderStatus {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @Column({ name: 'color_code', nullable: true })
  colorCode: string;

  @Column({ name: 'is_default', type: 'boolean', nullable: true })
  isDefault: boolean;

  @OneToMany(() => Order, (order) => order.status)
  orders: Order[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.status)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
