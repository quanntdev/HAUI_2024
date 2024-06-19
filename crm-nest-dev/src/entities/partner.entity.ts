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
import { ColumnPrimaryKeyInt, ColumnString, ColumnPhone } from './columns';
import { User } from './user.entity';
import { PartnerCustomer } from './partner-customer.entity';
import { PaymentPartner } from './payment-partner.entity';

@Entity('partners')
export class Partner {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @ColumnPhone()
  phone: string;

  @ColumnString()
  fax: string;

  @ColumnString()
  website: string;

  @ColumnString()
  email: string;

  @ColumnString()
  address: string;

  @ColumnString()
  priority: string;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.partner_id_assign)
  @JoinColumn({ name: 'user_assign' })
  userAssign: User;

  @OneToMany(() => PartnerCustomer, (partnerCus) => partnerCus.partners)
  @JoinColumn({ name: 'partners_customer' })
  partnersCustomer: PartnerCustomer[];

  @OneToMany(() => PaymentPartner, (paymentPartner) => paymentPartner.partner)
  paymentPartner: PaymentPartner[];
}

