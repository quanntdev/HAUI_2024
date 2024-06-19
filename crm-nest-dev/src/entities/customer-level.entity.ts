import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Customer } from './customer.entity';

@Entity('customer_level')
export class CustomerLevel {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @ColumnString()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Customer, (customer) => customer.level)
  customers: Customer[];
}
