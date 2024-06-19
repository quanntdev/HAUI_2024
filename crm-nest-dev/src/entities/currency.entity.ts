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
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Customer } from './customer.entity';
import { Payment } from './payment.entity';
import { PaymentPartner } from './payment-partner.entity';

@Entity('currencies')
export class Currency {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @ColumnString()
  sign: string;

  @ColumnBoolean()
  default: boolean;

  @Column('decimal', { precision: 14, scale: 10, default: 0.0 })
  exchange_rate: number;

  @ManyToOne(() => User, (user) => user.currencies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Deal, (deal) => deal.currency)
  deals: Deal[];

  @OneToMany(() => Customer, (customer) => customer.currency)
  customer: Customer[];

  @OneToMany(() => Order, (order) => order.currency)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Payment, (payment) => payment.currency)
  payment: Payment[];

  @OneToMany(() => PaymentPartner, (paymentPartner) => paymentPartner.currency)
  paymentPartner: PaymentPartner[];
}

export const selectedName: Array<keyof Currency> = ['name'];
