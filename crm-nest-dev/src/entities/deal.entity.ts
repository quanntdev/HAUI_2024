import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { ColumnDate, ColumnPrimaryKeyInt, ColumnString } from './columns';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Contact } from './contact.entity';
import { Category } from './category.entity';
import { Currency } from './currency.entity';
import { Tag } from './tag.entity';
import { Status } from './status.entity';
import { Order } from './order.entity';
import { Task } from './task.entity';

@Entity('deals')
export class Deal {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @ColumnString()
  url: string;

  @Column({ name: 'probability_winning', nullable: true })
  probabilityWinning: string;

  @Column({ name: 'forecast_close_date', nullable: true })
  forecastCloseDate: string;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => Order, (order) => order.deal)
  orders: Order[];

  @OneToMany(() => Task, (task) => task.deal)
  tasks: Task[];

  @ManyToOne(() => Currency, (currency) => currency.deals)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => User, (user) => user.deals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.deals)
  @JoinColumn({ name: 'user_assign_id' })
  userAssign: User;

  @ManyToOne(() => Customer, (customer) => customer.deals)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Contact, (contact) => contact.deals)
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @ManyToOne(() => Category, (category) => category.deals)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'deal_tag',
    joinColumn: {
      name: 'deal_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag;

  @ManyToOne(() => Status, (status) => status.deals)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
