import { Entity, ManyToOne, OneToMany, Column, JoinColumn } from 'typeorm';
import { ColumnPrimaryKeyInt } from './columns';
import { Country } from './country.entity';
import { Customer } from './customer.entity';
import { Invoice } from './invoice.entity';
@Entity('cities')
export class City {
  @ColumnPrimaryKeyInt()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Customer, (customer) => customer.city)
  customers: Customer[];

  @OneToMany(() => Invoice, (invoice) => invoice.city)
  invoices: Invoice;

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
