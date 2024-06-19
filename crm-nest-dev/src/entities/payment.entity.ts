import { Currency } from './currency.entity';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import {
  ColumnBigInt,
  ColumnDate,
  ColumnPrimaryKeyInt,
  ColumnString,
} from './columns';
import { PaymentMethod } from './payment-method.entity';
import { Invoice } from './invoice.entity';
import { Min } from 'class-validator';

@Entity('payments')
export class Payment {
  @ColumnPrimaryKeyInt()
  id: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  @Min(0)
  amount: number;

  @Column({ name: 'transaction', nullable: true })
  transactionId: string;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column('text', { nullable: true })
  notes: string;

  @ColumnString()
  attachment: string;

  @ManyToOne(() => PaymentMethod, (method) => method.payment)
  @JoinColumn({ name: 'method_id' })
  method: PaymentMethod;

  @ManyToOne(() => Invoice, (invoice) => invoice.payment)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => Customer, (customer) => customer.payment)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
  
  @ManyToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order: Customer;

  @ManyToOne(() => Currency, (cur) => cur.payment)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
