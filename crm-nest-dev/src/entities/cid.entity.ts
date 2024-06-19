import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Country } from './country.entity';
import { Customer } from './customer.entity';

@Entity('cids')
export class Cid {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  code: string;

  @ManyToOne(() => Country, (country) => country.cids)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

}
