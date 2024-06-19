import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from '../order-item/order-item.service';
import { OrderController } from './order.controller';
import {
  User,
  Customer,
  Deal,
  Order,
  OrderStatus,
  Contact,
  BillingType,
  Currency,
  Category,
  OrderItem,
  Invoice,
  InvoiceOrderItem,
  InvoiceCategory,
  Payment,
  Country,
  City,
  LogNote,
  Notification,
  Partner,
  PartnerCustomer,
  PartnerInvoice
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from '../invoices/invoices.service';
import { PartnerInvoicesService } from '../partner-invoices/partner-invoices.service';
import { StripeService } from '../stripe/stripe.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Deal,
      Customer,
      User,
      Order,
      OrderStatus,
      Contact,
      BillingType,
      Currency,
      Category,
      OrderItem,
      Invoice,
      InvoiceCategory,
      InvoiceOrderItem,
      Payment,
      City,
      Country,
      LogNote,
      Notification,
      Partner,
      PartnerCustomer,
      PartnerInvoice
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService, InvoicesService, PartnerInvoicesService, StripeService, MailService],
})
export class OrderModule {}
