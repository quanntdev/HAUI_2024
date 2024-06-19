import { Currency } from './currency.entity';
import { Order } from './order.entity';
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
import {
  ColumnPrimaryKeyInt,
} from './columns';
import { PaymentMethod } from './payment-method.entity';
import { Min } from 'class-validator';
import { PartnerInvoice } from './partner-invoice.entity';
import { Partner } from './partner.entity';
import { User } from './user.entity';

@Entity('payments_partner')
export class PaymentPartner {
  @ColumnPrimaryKeyInt()
  id: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  @Min(0)
  amount: number;

  @Column({ name: 'transaction', nullable: true })
  transactionId: string;

  @Column({ name: 'payment_date',  nullable: true })
  paymentDate: Date;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => PaymentMethod, (method) => method.paymentPartner)
  @JoinColumn({ name: 'method_id' })
  method: PaymentMethod;

  @ManyToOne(() => Currency, (cur) => cur.paymentPartner)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => PartnerInvoice, (invoice) => invoice.paymentPartner)
  @JoinColumn({ name: 'invoice_partner_id' })
  invoicePartner: PartnerInvoice;

  @ManyToOne(() => Order, (order) => order.paymentPartner)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Partner, (partner) => partner.paymentPartner)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @ManyToOne(() => User, (user) => user.paymentPartner)
  @JoinColumn({ name: 'user_id' })
  user: Partner;

  @OneToMany(() => PartnerInvoice, (invoice) => invoice.paymentPartnerInvoice)
  invoicePartnerPayment: PartnerInvoice[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
