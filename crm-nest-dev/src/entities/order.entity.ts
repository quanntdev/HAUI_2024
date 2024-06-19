import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString, ColumnDate } from './columns';
import { Deal } from './deal.entity';

import { Customer } from './customer.entity';
import { Contact } from './contact.entity';
import { OrderStatus } from './order-status.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { Currency } from './currency.entity';
import { BillingType } from './billing-type.entity';
import { Invoice } from './invoice.entity';
import { Task } from './task.entity';
import { Payment } from './payment.entity';
import { PartnerCustomer } from './partner-customer.entity';
import { PartnerInvoice } from './partner-invoice.entity';
import { PaymentPartner } from './payment-partner.entity';

@Entity('orders')
export class Order {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'delevery_date', type: 'date', nullable: true })
  deleveryDate: Date;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    name: 'order_value',
    nullable: true,
  })
  orderValue: number;

  @Column({ name: 'rate_point', nullable: true })
  ratePoint: number;

  @ColumnString()
  review: string;

  @ManyToOne(() => BillingType, (billingType) => billingType.orders)
  @JoinColumn({ name: 'billing_type_id' })
  billingType: BillingType;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'order_manager', nullable: true })
  orderManager: string;

  @ManyToOne(() => Category, (category) => category.orders)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => Task, (task) => task.order)
  tasks: Task[];

  @ManyToOne(() => Currency, (currency) => currency.orders)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => Deal, (deal) => deal.orders)
  @JoinColumn({ name: 'deal_id' })
  deal: Deal;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Contact, (contact) => contact.orders)
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_assign_id' })
  userAssign: User;

  @ManyToOne(() => OrderStatus, (status) => status.orders)
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @OneToMany(() => Invoice, (invoice) => invoice.order)
  invoices: Invoice[];

  @OneToMany(() => PartnerInvoice, (partnerInvoice) => partnerInvoice.order)
  partnersInvoice: PartnerInvoice[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.order)
  payment: Payment[];

  @OneToMany(() => PaymentPartner, (paymentPartner) => paymentPartner.order)
  paymentPartner: Payment[];

  @OneToMany(() => PartnerCustomer, (partner) => partner.partnerOrder)
  partners: PartnerCustomer[];
}

export const selectedCurrency: Array<keyof Order> = ['currency'];
