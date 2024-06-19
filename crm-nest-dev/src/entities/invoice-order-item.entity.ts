import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  ColumnBigInt,
  ColumnPrimaryKeyInt,
  ColumnString,
  ColumnTinyInt,
} from './columns';
import { ColumnInt } from './columns/int';
import { Invoice } from './invoice.entity';
import { OrderItem } from './order-item.entity';

@Entity('invoice_order_items')
export class InvoiceOrderItem {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  name: string;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  value: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  tax_rate: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0.0 })
  total_value: number;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.invoiceOrderItems)
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceOrderItems)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}
