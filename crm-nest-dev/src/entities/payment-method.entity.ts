import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Payment } from './payment.entity';
import { PaymentPartner } from './payment-partner.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.method)
  payment: Payment[];

  @OneToMany(() => PaymentPartner, (payment) => payment.method)
  paymentPartner: PaymentPartner[];
}
