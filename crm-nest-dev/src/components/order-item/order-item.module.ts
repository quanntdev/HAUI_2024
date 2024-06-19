import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderStatus, OrderItem, LogNote } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderStatus, OrderItem, LogNote])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
