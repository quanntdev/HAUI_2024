import { Module } from '@nestjs/common';
import { PaymentPartnerController } from './payment-partner.controller';
import { PaymentPartnerService } from './payment-partner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency, LogNote, Order, Partner, PartnerInvoice, PaymentMethod, PaymentPartner } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentPartner, Partner, Order, PaymentMethod, Currency, PartnerInvoice, LogNote])],
  controllers: [PaymentPartnerController],
  providers: [PaymentPartnerService]
})
export class PaymentPartnerModule {}
