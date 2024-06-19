import { Module } from '@nestjs/common';
import { PartnerCustomerController } from './partner-customer.controller';
import { PartnerCustomerService } from './partner-customer.service';

@Module({
  controllers: [PartnerCustomerController],
  providers: [PartnerCustomerService]
})
export class PartnerCustomerModule {}
