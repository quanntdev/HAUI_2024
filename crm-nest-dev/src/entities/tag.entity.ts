import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Contact } from './contact.entity';
import { Customer } from './customer.entity';
import { Deal } from './deal.entity';
import { User } from './user.entity';

@Entity('tags')
export class Tag {
  @ColumnPrimaryKeyInt()
  id: number;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ColumnString()
  @Column({ unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'contact_tag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' },
  })
  contact: Contact;

  @ManyToMany(() => Customer)
  @JoinTable({
    name: 'customer_tag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'customer_id', referencedColumnName: 'id' },
  })
  customer: Customer;

  @ManyToMany(() => Deal)
  @JoinTable({
    name: 'deal_tag',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'deal_id', referencedColumnName: 'id' },
  })
  deal: Deal;
}
