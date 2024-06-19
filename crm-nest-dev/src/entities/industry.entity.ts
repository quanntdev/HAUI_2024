import {
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
import { Customer } from './customer.entity';

@Entity('industries')
export class Industry {
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

  @ManyToOne(() => User, (user) => user.industries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Customer, (customer) => customer.industry)
  customers: Customer[];
}
