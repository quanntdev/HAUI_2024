import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';

@ApiTags('Order Status')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/order-status')
@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Get()
  findAll() {
    return this.orderStatusService.findAll();
  }
}
