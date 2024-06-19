import { Module } from '@nestjs/common';
import { InvoiceAttachmentsService } from './invoice-attachments.service';
import { InvoiceAttachmentsController } from './invoice-attachments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceAttachment } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceAttachment])],
  controllers: [InvoiceAttachmentsController],
  providers: [InvoiceAttachmentsService]
})
export class InvoiceAttachmentsModule { }
