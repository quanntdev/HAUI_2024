import { Module } from '@nestjs/common';
import { PartnerInvoicesService } from './partner-invoices.service';
import { PartnerInvoicesController } from './partner-invoices.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { Currency, Customer, LogNote, Order, PartnerInvoice } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PartnerInvoice,
      Customer,
      Order,
      Currency,
      LogNote
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PartnerInvoicesController],
  providers: [PartnerInvoicesService]
})
export class PartnerInvoicesModule {}
