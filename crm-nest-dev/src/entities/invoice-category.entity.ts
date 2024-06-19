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
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';

@Entity('invoice_categories')
export class InvoiceCategory {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.invoiceCategories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.invoiceCategory)
  invoices: Invoice[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
