import {
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  ColumnPasswordHash,
  ColumnUsername,
  ColumnEmail,
  ColumnTinyInt,
  ColumnPrimaryKeyInt,
  ColumnBoolean,
  ColumnLongString,
  ColumnString,
} from './columns';
import { Profile } from './profile.entity';
import { Tag } from './tag.entity';
import { Category } from './category.entity';
import { Customer } from './customer.entity';
import { Deal } from './deal.entity';
import { Currency } from './currency.entity';
import { EmployeeConfig } from './employeeConfig.entity';
import { Industry } from './industry.entity';
import { Status } from './status.entity';
import { Exclude } from 'class-transformer';
import { Order } from './order.entity';
import { InvoiceCategory } from './invoice-category.entity';
import { Invoice } from './invoice.entity';
import { Task } from './task.entity';
import { LogNote } from './log-note.entity';
import { Notification } from './notification.entity';
import { Partner } from './partner.entity';
import { PaymentPartner } from './payment-partner.entity';

@Entity('users')
export class User {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnEmail(true)
  @Index('email', { unique: true })
  email: string;

  @ColumnPasswordHash()
  @Exclude()
  password: string;

  @ColumnTinyInt(true)
  role: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ColumnLongString()
  refresh_token: string;

  @Column({type: "text" , nullable: true})
  reset_password_token: string;

  @ColumnString()
  language: string;

  // Time
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => Category, (category) => category.user)
  category_id: Category[];

  @OneToMany(() => Customer, (customer) => customer.user)
  customer_id: Customer[];

  @OneToMany(() => Customer, (customer) => customer.userAssign)
  customer_id_assign: Customer[];

  @OneToMany(() => Partner, (partner) => partner.userAssign)
  partner_id_assign: Partner[];

  @OneToMany(() => LogNote, (log) => log.user)
  notes: LogNote[];

  @OneToMany(() => Deal, (deal) => deal.user)
  deals: Deal[];

  @OneToMany(() => Deal, (deal) => deal.userAssign)
  dealsAssign: Deal[];

  @OneToMany(() => Order, (order) => order.userAssign)
  orders: Order[];

  @OneToMany(() => Industry, (industry) => industry.user)
  industries: Industry[];

  @OneToMany(() => Currency, (currency) => currency.user)
  currencies: Currency[];

  @OneToMany(() => EmployeeConfig, (employees) => employees.user)
  employeesConfig: EmployeeConfig[];

  @OneToMany(() => Status, (status) => status.user)
  statuses: Status[];

  @OneToMany(() => InvoiceCategory, (invoiceCategory) => invoiceCategory.user)
  invoiceCategories: InvoiceCategory[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Task, (task) => task.createdByUser)
  createdTask: Task[];

  @ManyToMany(() => Task, (task) => task.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  

  @JoinTable({
    name: 'task_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
  })
  tasks?: Task[];

  @OneToMany(() => Notification, (noti) => noti.user)
  notifications: Notification[];

  @OneToMany(() => PaymentPartner, (paymentPartner) => paymentPartner.user)
  paymentPartner: PaymentPartner[];
}

export const selectedKeysUser: Array<keyof User> = ['id', 'email', 'role'];
