import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnPrimaryKeyInt, ColumnString } from './columns';
import { Invoice } from './invoice.entity';

@Entity('invoice_attachments')
export class InvoiceAttachment {
  @ColumnPrimaryKeyInt()
  id: number;

  @ColumnString()
  file_url: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceAttachments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
