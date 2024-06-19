import { Controller } from '@nestjs/common';
import { InvoiceAttachmentsService } from './invoice-attachments.service';

@Controller('invoice-attachments')
export class InvoiceAttachmentsController {
  constructor(private readonly invoiceAttachmentsService: InvoiceAttachmentsService) {}
}
