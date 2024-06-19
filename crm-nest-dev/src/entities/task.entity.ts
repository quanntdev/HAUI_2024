import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  UpdateDateColumn,
  JoinTable,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import {
  ColumnInt,
  ColumnPrimaryKeyInt,
  ColumnString,
  ColumnBoolean,
} from './columns';

import { Customer } from './customer.entity';
import { Order } from './order.entity';
import { Deal } from './deal.entity';
import { Invoice } from './invoice.entity';
import { User } from './user.entity';
import { Checklist } from './checklist.entity';

@Entity('tasks')
export class Task {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @Column({ name: 'priority_id' })
  priorityId: Number;

  @Column({ name: 'status_id' })
  statusId: Number;

  // @Column({ name: 'position' })
  // position: Number;

  @Column({
    type: 'datetime',
    precision: 6,
    nullable: true,
    name: 'start_date',
  })
  startDate: Date;

  @Column({
    type: 'datetime',
    precision: 6,
    nullable: true,
    name: 'due_date',
  })
  dueDate: Date;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'boolean', default: 0, name: 'is_archived' })
  isArchived: boolean;

  @Column({ name: 'is_public', type: 'boolean' })
  isPublic: boolean;

  @OneToMany(() => Checklist, (checklist) => checklist.task)
  checklist: Checklist[];

  @ManyToOne(() => Customer, (customer) => customer.tasks)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Order, (order) => order.tasks)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Invoice, (invoice) => invoice.tasks)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => Deal, (deal) => deal.tasks)
  @JoinColumn({ name: 'deal_id' })
  deal: Deal;

  @ManyToOne(() => User, (user) => user.createdTask)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @ManyToMany(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users?: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
