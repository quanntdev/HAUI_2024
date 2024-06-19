import { Customer } from './../../entities/customer.entity';
import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice, LogNote, PartnerInvoice, Payment } from 'src/entities';
import { OrderItem } from '../../entities/order-item.entity';
import { InvoiceCategory } from '../../entities/invoice-category.entity';
import { Order } from '../../entities/order.entity';
import { InvoiceOrderItem } from '../../entities/invoice-order-item.entity';
import { City } from '../../entities/city.entity';
import { Country } from '../../entities/country.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CronInvoiceService } from './invoices-cron.service';
import { Currency } from 'src/entities';
import { PartnerInvoicesService } from '../partner-invoices/partner-invoices.service';
import { StripeService } from '../stripe/stripe.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      OrderItem,
      InvoiceCategory,
      Order,
      InvoiceOrderItem,
      Payment,
      City,
      Country,
      LogNote,
      Currency,
      Customer,
      PartnerInvoice
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, CronInvoiceService, PartnerInvoicesService, StripeService, MailService],
})
export class InvoicesModule {}
