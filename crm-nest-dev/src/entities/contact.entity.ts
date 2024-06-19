import {
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import {
  ColumnEmail,
  ColumnPhone,
  ColumnPrimaryKeyInt,
  ColumnTinyInt,
  ColumnFirstName,
  ColumnLastName,
  ColumnText,
  ColumnString,
} from './columns';
import { Deal } from './deal.entity';
import { Tag } from './tag.entity';
import { Customer } from './customer.entity';
import { Order } from './order.entity';

@Entity('contacts')
export class Contact {
  @ColumnPrimaryKeyInt()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @ColumnEmail()
  @Index('email')
  email: string;

  @ColumnTinyInt()
  gender: number;

  @ColumnPhone()
  phone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ColumnText()
  avatar: string;

  @Column({ name: 'card_img', nullable: true })
  cardImage: string;

  @ColumnString()
  sector: string;

  @OneToMany(() => Deal, (deal) => deal.contact)
  deals: Deal[];

  @OneToMany(() => Order, (order) => order.contact)
  orders: Order[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'contact_tag',
    joinColumn: {
      name: 'contact_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag;

  @ManyToOne(() => Customer, (customer) => customer.contacts)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
