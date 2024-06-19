import {
  DeleteDateColumn,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Customer } from './customer.entity';

@Entity('sale_channels')
export class SaleChannel {
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

  @OneToMany(() => Customer, (customer) => customer.channel)
  customers: Customer[];


}
