import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency, Partner, PartnerInvoice, PaymentPartner, User } from 'src/entities';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, User, PaymentPartner, PartnerInvoice, Currency])],
  providers: [PartnerService, CheckIsEmail],
  controllers: [PartnerController]
})
export class PartnerModule {}
