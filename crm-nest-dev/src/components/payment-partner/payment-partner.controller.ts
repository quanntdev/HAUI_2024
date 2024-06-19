import { CreatePaymentManyInvoiceDTO, CreatePaymentPartnerDto } from './dto/create-payment-partner.dto';
import { Body, Controller, Post, Req, UseGuards, Headers, Get, Query, Request, Param, Delete, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { RequestWithUser } from 'src/common/interfaces';
import { PaymentPartnerService } from './payment-partner.service';
import { PaginationQuery } from 'src/common/dtos';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileRaw } from 'src/common/uploadImageHelper/file-helper';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiTags('Payments-Parter')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/payment-partner')
export class PaymentPartnerController {
  constructor(
    private readonly paymentPartnerService: PaymentPartnerService,
  ){}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw ))
  async create(
    @BodyWithMiddleware() createOrderItemDto: CreatePaymentPartnerDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
  ) {
    return await this.paymentPartnerService.create(createOrderItemDto, headers, req, attachment);
  }

  @Post('/many-invoice')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw ))
  async createMany(
    @BodyWithMiddleware() createOrderItemDto: CreatePaymentManyInvoiceDTO,
    @Req() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
  ) {
    return await this.paymentPartnerService.createPaymentWithManyInvoice(createOrderItemDto, headers, req, attachment);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Request() req: RequestWithUser,
    ) {
    return this.paymentPartnerService.findAll(pagination, req);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentPartnerService.findOne(+id, pagination,headers, req);
  }

  @Delete(':id')
  Delete(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentPartnerService.delete(+id, headers, req);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() createOrderItemDto: CreatePaymentPartnerDto,
    @Request() req: RequestWithUser,
    @Headers() Headers,
  ) {
    return this.paymentPartnerService.update(+id, createOrderItemDto, req, Headers);
  }
}
