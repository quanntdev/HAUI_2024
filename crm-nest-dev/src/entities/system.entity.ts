import {
  Entity,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';

@Entity('system')
export class System {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  logo: string;
}
