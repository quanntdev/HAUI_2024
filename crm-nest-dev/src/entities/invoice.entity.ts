import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import {
  ColumnBigInt,
  ColumnDate,
  ColumnPrimaryKeyInt,
  ColumnString,
  ColumnTinyInt,
} from './columns';
import { Order } from './order.entity';
import { InvoiceOrderItem } from './invoice-order-item.entity';
import { InvoiceAttachment } from './invoice-attachment.entity';
import { User } from './user.entity';
import { InvoiceCategory } from './invoice-category.entity';
import { Payment } from './payment.entity';
import { Country } from './country.entity';
import { City } from './city.entity';
import { Min } from 'class-validator';
import { Task } from './task.entity';
import { PartnerInvoice } from './partner-invoice.entity';

@Entity('invoices')
export class Invoice {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  code: string;

  @ColumnString()
  customer_name: string;

  @ColumnString()
  country_name: string;

  @ColumnString()
  province_name: string;

  @ColumnString()
  postal_code: string;

  @ColumnString()
  currency_sign: string;

  @ColumnString()
  currency_name: string;

  @ColumnString()
  address: string;

  @ColumnString()
  @ColumnDate()
  start_date: Date;

  @ColumnDate()
  due_date: Date;

  @ColumnBigInt()
  total_item: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  total_original_value: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  total_tax_value: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  total_value: number;

  @Column('decimal', { precision: 14, scale: 2, name: 'balance_due' })
  @Min(0)
  balanceDue: number;

  @ColumnTinyInt()
  status: number;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payment: Payment[];

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, (order) => order.invoices)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToMany(() => PartnerInvoice, (partnerInvoice) => partnerInvoice.invoice)
  partnersInvoice: PartnerInvoice[];

  @ManyToOne(
    () => InvoiceCategory,
    (invoiceCategory) => invoiceCategory.invoices,
  )
  @JoinColumn({ name: 'invoice_category_id' })
  invoiceCategory: InvoiceCategory;

  @OneToMany(
    () => InvoiceOrderItem,
    (invoiceOrderItem) => invoiceOrderItem.invoice,
  )
  invoiceOrderItems: InvoiceOrderItem[];

  @OneToMany(
    () => InvoiceAttachment,
    (invoiceAttachment) => invoiceAttachment.invoice,
  )
  invoiceAttachments: InvoiceAttachment[];

  @OneToMany(() => Task, (task) => task.invoice)
  tasks: Task[];

  @ManyToOne(() => Country, (country) => country.invoices)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => City, (city) => city.invoices)
  @JoinColumn({ name: 'province_id' })
  city: City;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
