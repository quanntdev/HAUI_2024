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

@Entity('billing_types')
export class BillingType {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @Column({ name: 'is_default', type: 'boolean' })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Order, (order) => order.billingType)
  orders: Order[];
}
