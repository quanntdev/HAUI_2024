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
import { ColumnDate, ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Currency } from './currency.entity';

import { Order } from './order.entity';
import { OrderStatus } from './order-status.entity';
import { InvoiceOrderItem } from './invoice-order-item.entity';

@Entity('order_items')
export class OrderItem {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  title: string;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  value: number;

  @Column({ name: 'estimate_hour', nullable: true })
  estimateHour: string;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate: Date;

  @Column('decimal', { name: 'unit_price', precision: 14, scale: 2, default: 0.0 })
  unitPrice: number;

  @ManyToOne(() => OrderStatus, (status) => status.orderItems)
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToMany(
    () => InvoiceOrderItem,
    (invoiceOrderItem) => invoiceOrderItem.orderItem,
  )
  invoiceOrderItems: InvoiceOrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
