import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Headers,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from '../invoices/invoices.service';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { PaginationQuery } from 'src/common/dtos';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { UserSignedGuard } from 'src/common/guards/user';
import { RequestWithUser } from 'src/common/interfaces';
import {
  AttachmentImagePaymentsPipe,
  multerOptions,
  uploadFileRaw,
} from 'src/common/uploadImageHelper/file-helper';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly invoiceService: InvoicesService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw ))
  async create(
    @BodyWithMiddleware() createPaymentDto: CreatePaymentDto,
    @Req() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
  ) {
    const payment = await this.paymentsService.create(
      createPaymentDto,
      attachment,
      headers,
    );
    try {
      if (payment) {
        return this.invoiceService.updateStatusAndCreatePayment(
          createPaymentDto,
          req,
          payment,
          headers,
        );
      } else {
        throw new BadRequestException('Invalid form data');
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Query() searchPaymentDto: SearchPaymentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.paymentsService.findAll(pagination, searchPaymentDto, req);
  }

  @Get('/by-date')
  findAllByDate(
    @Query() pagination: PaginationQuery,
    @Query() searchPaymentDto: SearchPaymentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.paymentsService.findAllByDate(pagination, searchPaymentDto, req);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
    @Request() req: RequestWithUser
  ) {
    return this.paymentsService.findOne(+id, pagination,headers, req);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('attachment', multerOptions))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @UploadedFile(AttachmentImagePaymentsPipe) attachment: Express.Multer.File,
    @Headers() headers,
  ) {
    return this.paymentsService.update(
      +id,
      updatePaymentDto,
      req,
      attachment,
      headers,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers) {
    return this.paymentsService.remove(+id, headers);
  }
}
