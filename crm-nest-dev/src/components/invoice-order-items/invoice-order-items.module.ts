import { Module } from '@nestjs/common';
import { InvoiceOrderItemsService } from './invoice-order-items.service';
import { InvoiceOrderItemsController } from './invoice-order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceOrderItem } from '../../entities/invoice-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceOrderItem])],
  controllers: [InvoiceOrderItemsController],
  providers: [InvoiceOrderItemsService]
})
export class InvoiceOrderItemsModule { }
