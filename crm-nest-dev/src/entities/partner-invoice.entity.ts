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
import { ColumnPrimaryKeyInt, ColumnString, ColumnDate, ColumnTinyInt } from './columns';
import { Order } from './order.entity';
import { Invoice } from './invoice.entity';
import { PartnerCustomer } from './partner-customer.entity';
import { PaymentPartner } from './payment-partner.entity';

@Entity('partner_invoice')
export class PartnerInvoice {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  code: string;

  @Column({name: "partner_name", type: 'varchar', length: 255,})
  partnerName: string;

  @ColumnString()
  currency_sign: string;

  @ColumnString()
  currency_name: string;

  @Column({name: 'partner_sale_percent'})
  salePercent: string;

  @Column({name: 'VAT'})
  VAT: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  commisson_amount: number;

  @ColumnString()
  @ColumnDate()
  start_date: Date;

  @ColumnDate()
  due_date: Date;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  total_value: number;

  @ColumnTinyInt()
  status: number;

  @ManyToOne(() => Order, (order) => order.partnersInvoice)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Invoice, (invoice) => invoice.partnersInvoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @OneToMany(() => PaymentPartner, (payment) => payment.invoicePartner)
  paymentPartner: PaymentPartner[];

  @ManyToOne(() => PaymentPartner, (payment) => payment.invoicePartnerPayment)
  @JoinColumn({ name: 'payment_id' })
  paymentPartnerInvoice: PaymentPartner;

  @ManyToOne(() => PartnerCustomer, (partnerCustomer) => partnerCustomer.partnersInvoice)
  @JoinColumn({ name: 'customer_partner_id' })
  customerPartner: PartnerCustomer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

