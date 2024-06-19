import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  Headers,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { UserSignedGuard } from '../../common/guards/user';
import { PaginationQuery } from '../../common/dtos';
import { FindDealDto } from './dto/find-deal.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrderService } from '../order/order.service';
import { FindOrderDto } from '../order/dto/find-order.dto';
import { Req } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileRaw } from 'src/common/uploadImageHelper/file-helper';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiTags('Deals')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/deals')
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw))
  @ApiConsumes('multipart/form-data')
  async create(
    @BodyWithMiddleware() createDealDto: CreateDealDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
  ) {
    if (attachment.length == 0) {
      return await this.dealsService.create(createDealDto, req, headers);
    }
    return await this.dealsService.create(
      createDealDto,
      req,
      headers,
      attachment,
    );
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Query() query: FindDealDto,
    @Request() req: RequestWithUser,
  ) {
    return this.dealsService.findAll(pagination, query, req);
  }
  @Get(':id/orders')
  findAllOrderItemsByOrderId(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Query() query: FindOrderDto,
  ) {
    return this.orderService.findByDealId(+id, pagination, query.statusId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @BodyWithMiddleware() updateStatus: UpdateStatusDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.dealsService.updateStatus(+id, updateStatus, req, headers);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
  ) {
    return this.dealsService.findOne(+id, req, pagination, headers);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @BodyWithMiddleware() updateDealDto: UpdateDealDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.dealsService.update(+id, updateDealDto, req, headers);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers) {
    return this.dealsService.remove(+id, headers);
  }
}
