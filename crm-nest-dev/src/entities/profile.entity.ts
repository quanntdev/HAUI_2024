import {
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  AfterUpdate,
  Column,
} from 'typeorm';
import {
  ColumnString,
  ColumnText,
  ColumnBoolean,
  ColumnPhone,
  ColumnDate,
} from './columns';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnString()
  first_name: string;

  @ColumnString()
  last_name: string;

  @ColumnBoolean()
  gender: boolean;

  @ColumnPhone()
  phone: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  birth_of_date: string;

  @ColumnDate()
  date_of_joining: Date;

  @ColumnString()
  address: string;

  @Column({ name: 'profile_img', nullable: true })
  profileImg: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export const selectedKeysProfile: Array<keyof Profile> = [
  'id',
  'first_name',
  'last_name',
  'gender',
  'phone',
  'birth_of_date',
  'date_of_joining',
  'address',
  'profileImg',
  'user',
];
