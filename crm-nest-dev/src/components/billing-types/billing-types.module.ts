import { Module } from '@nestjs/common';
import { BillingTypesService } from './billing-types.service';
import { BillingTypesController } from './billing-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingType } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([BillingType])],
  controllers: [BillingTypesController],
  providers: [BillingTypesService],
})
export class BillingTypesModule {}
