import {
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Cid } from './cid.entity';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Customer } from './customer.entity';
import { City } from './city.entity';
import { Invoice } from './invoice.entity';

@Entity('countries')
export class Country {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @UpdateDateColumn({ name: 'created_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Customer, (customer) => customer.country)
  customers: Customer[];

  @OneToMany(() => Cid, (cid) => cid.country)
  cids: Cid[];

  @OneToMany(() => Invoice, (invoice) => invoice.country)
  invoices: Invoice;

  @OneToMany(() => City, (cities) => cities.country)
  cities: City[];
}
