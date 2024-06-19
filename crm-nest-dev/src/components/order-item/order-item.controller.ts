import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UserSignedGuard } from 'src/common/guards/user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindOrderItemDto } from './dto/find-order-item.dto';
import { PaginationQuery } from 'src/common/dtos';
import { RequestWithUser } from 'src/common/interfaces';

@ApiTags('Orders Items')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(
    @Body() createOrderItemDto: CreateOrderItemDto, 
    @Req() req: RequestWithUser,
  ) {
    return this.orderItemService.create(createOrderItemDto, req);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Query() query: FindOrderItemDto,
  ) {
    return this.orderItemService.findAll(pagination, query.statusId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
    @Req() req: RequestWithUser
  ) {
    return this.orderItemService.update(+id, updateOrderItemDto, req);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.orderItemService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.orderItemService.remove(+id, req);
  }
}
