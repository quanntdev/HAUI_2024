import { PartnerInvoice } from './partner-invoice.entity';
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
import { ColumnPrimaryKeyInt } from './columns';
import { Customer } from './customer.entity';
import { Partner } from './partner.entity';
import { Order } from './order.entity';

@Entity('partners_customer')
export class PartnerCustomer {
  @ColumnPrimaryKeyInt()
  id: number;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    name: 'partner_sale_value',
    nullable: true,
  })
  saleValue: number;

  @Column({name: 'partner_sale_type'})
  saleType: string;

  @Column({name: 'partner_sale_percent', nullable: true})
  salePercent: string;


  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;


  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => Customer, (customer) => customer.partners)
  @JoinColumn({ name: 'partner_customer_id' })
  partnerCustomer: Customer;

  @ManyToOne(() => Partner, (partner) => partner.partnersCustomer)
  @JoinColumn({ name: 'partner_id' })
  partners: Partner;

  @ManyToOne(() => Order, (order) => order.partners)
  @JoinColumn({ name: 'partner_order_id' })
  partnerOrder: Partner;

  @OneToMany(() => PartnerInvoice, (partnerInvoice) => partnerInvoice.customerPartner)
  partnersInvoice: PartnerInvoice[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

