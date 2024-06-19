import { Module } from '@nestjs/common';
import { InvoiceCategoriesService } from './invoice-categories.service';
import { InvoiceCategoriesController } from './invoice-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceCategory } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceCategory])],
  controllers: [InvoiceCategoriesController],
  providers: [InvoiceCategoriesService]
})
export class InvoiceCategoriesModule { }
