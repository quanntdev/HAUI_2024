import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import {
  Invoice,
  InvoiceCategory,
  Order,
  OrderItem,
  Payment,
  PaymentMethod,
  Country,
  City,
  Currency,
  LogNote,
  Customer,
  PartnerInvoice,
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from '../invoices/invoices.service';
import { InvoiceOrderItem } from '../../entities/invoice-order-item.entity';
import { PartnerInvoicesService } from '../partner-invoices/partner-invoices.service';
import { StripeService } from '../stripe/stripe.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Invoice,
      PaymentMethod,
      OrderItem,
      InvoiceOrderItem,
      InvoiceCategory,
      Order,
      Country,
      Currency,
      City,
      LogNote,
      Customer,
      PartnerInvoice
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, InvoicesService, PartnerInvoicesService, StripeService, MailService],
})
export class PaymentsModule {}
