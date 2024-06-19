import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import {
  ColumnPhone,
  ColumnPrimaryKeyInt,
  ColumnString,
} from './columns';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { Deal } from './deal.entity';
import { EmployeeConfig } from './employeeConfig.entity';
import { Industry } from './industry.entity';
import { Contact } from './contact.entity';
import { Country } from './country.entity';
import { Cid } from './cid.entity';
import { City } from './city.entity';
import { Order } from './order.entity';
import { Task } from './task.entity';
import { Currency } from './currency.entity';
import { CustomerLevel } from './customer-level.entity';
import { SaleChannel } from './sale-channel.entity';
import { Payment } from './payment.entity';
import { PartnerCustomer } from './partner-customer.entity';

@Entity('customers')
export class Customer {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @ColumnString()
  subName: string;

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

  @Column({ name: 'establishment', type: 'date', nullable: true })
  esTabLishMent: Date;

  @ColumnString()
  capital: string;

  @ColumnString()
  cidCode: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @ManyToOne(() => City, (cities) => cities.customers)
  @JoinColumn({ name: 'province_id' })
  city: City;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => EmployeeConfig, (employees) => employees.customers)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeConfig;

  @ManyToOne(() => User, (user) => user.customer_id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Deal, (deal) => deal.customer)
  deals: Deal[];

  @OneToMany(() => PartnerCustomer, (partner) => partner.partnerCustomer)
  partners: PartnerCustomer[];

  @ManyToOne(() => Industry, (industry) => industry.customers)
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @OneToMany(() => Contact, (contact) => contact.customer)
  contacts: Contact[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Currency, (currency) => currency.customer)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'customer_tag',
    joinColumn: {
      name: 'customer_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag;

  @ManyToOne(() => Country, (country) => country.customers)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToOne(() => Cid)
  @JoinColumn({ name: 'cid_id' })
  cid: Cid;

  @OneToMany(() => Task, (task) => task.customer)
  tasks: Task[];

  @ManyToOne(() => CustomerLevel, (level) => level.customers)
  @JoinColumn({ name: 'level_id' })
  level: CustomerLevel;

  @ManyToOne(() => SaleChannel, (channel) => channel.customers)
  @JoinColumn({ name: 'channel_id' })
  channel: SaleChannel;

  @ManyToOne(() => User, (user) => user.customer_id_assign)
  @JoinColumn({ name: 'user_assign' })
  userAssign: User;

  @OneToMany(() => Payment, (payment) => payment.customer)
  payment: Payment[];
}
