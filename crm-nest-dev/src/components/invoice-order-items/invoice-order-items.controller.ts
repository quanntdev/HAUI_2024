import { Controller } from '@nestjs/common';
import { InvoiceOrderItemsService } from './invoice-order-items.service';

@Controller('invoice-order-items')
export class InvoiceOrderItemsController {
  constructor(private readonly invoiceOrderItemsService: InvoiceOrderItemsService) {}
}
