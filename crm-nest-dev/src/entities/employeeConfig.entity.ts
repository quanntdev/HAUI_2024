import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnBigInt, ColumnPrimaryKeyInt } from './columns';
import { User } from './user.entity';
import { Customer } from './customer.entity';

@Entity('employees')
export class EmployeeConfig {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnBigInt()
  start_number: number;

  @ColumnBigInt()
  end_number: number;

  @OneToMany(() => Customer, (customer) => customer.employee)
  customers: Customer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.employeesConfig)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
