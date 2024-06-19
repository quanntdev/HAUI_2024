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
  Headers,
  UseInterceptors,
  UploadedFiles,
  Request
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from '../order-item/order-item.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-oder.dto';
import { UserSignedGuard } from 'src/common/guards/user';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PaginationQuery, PaginationQueryOrder } from 'src/common/dtos';
import { FindOrderDto } from './dto/find-order.dto';
import { FindOrderItemDto } from '../order-item/dto/find-order-item.dto';
import { InvoicesService } from '../invoices/invoices.service';
import { RequestWithUser } from 'src/common/interfaces';
import { Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileRaw } from 'src/common/uploadImageHelper/file-helper';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('api/orders')
@UseGuards(UserSignedGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw ))
  async create(
    @BodyWithMiddleware() createOrderDto: CreateOrderDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>
  ) {
    if(attachment.length == 0) {
      return await this.orderService.create(createOrderDto,  req, headers);
    }

    return await this.orderService.create(createOrderDto, req, headers,  attachment);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQueryOrder,
    @Query() query: FindOrderDto,
    @Request() req: RequestWithUser,
    ) {
    return this.orderService.findAll(pagination, query, req);
  }
  @Get(':id/invoices-list')
  findValidInvoicesByOrderId(@Param('id') id: string) {
    return this.invoicesService.findValiToPaidInvoiceByOrderId(+id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
    @Request() req: RequestWithUser,
  ) {
    return this.orderService.findOne(+id, pagination,headers, req);
  }
  @Get(':id/order-items')
  findAllOrderItemsByOrderId(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Query() query: FindOrderItemDto,
  ) {
    return this.orderItemService.findByOrderId(+id, pagination, query.statusId);
  }
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateStatusDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.orderService.updateStatus(+id, req, updateStatus, headers);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.orderService.update(+id, req, updateOrderDto, headers);
  }

  @Delete(':id')
  remove(@Param('id') id: string,  @Headers() headers) {
    return this.orderService.remove(+id, headers);
  }

  @Get('/partner-order-invoice/:id')
  getOrderOfPartner(@Param('id') id: string,  @Headers() headers) {
    return this.orderService.getOrderOfPartner(+id, headers)
  }
}
