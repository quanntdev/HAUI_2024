import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseArrayPipe,
  UploadedFile,
  Request,
  Req,
  Headers,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CronInvoiceService } from './invoices-cron.service';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  UpdateInvoiceDto,
  UpdateInvoiceNameDto,
  UpdateInvoiceStatusDto,
} from './dto/update-invoice.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from '../../common/guards/user';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadImage } from '../../common/validatorContraints/imageStorage';
import { validateImage } from 'src/common/validatorContraints/validateImage';
import { PaginationQuery } from '../../common/dtos/pagination';
import { SearchInvoiceDto } from './dto/search-invoice.dto';
import { RequestWithUser } from 'src/common/interfaces';

@ApiTags('Invoice')
@Controller('api/invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly invoicesCronService: CronInvoiceService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Request() req: any,
    @Headers() headers,
  ) {
    return this.invoicesService.create(
      createInvoiceDto,
      +req.user.userId,
      headers,
    );
  }

  // @ApiBearerAuth()
  // @UseGuards(UserSignedGuard)
  @Get('/status')
  findAllStatus() {
    return this.invoicesService.findAllStatus();
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Get('/refresh-invoice-status')
  updateStatusByHandleRequest() {
    const handlebyRequest = true;
    return this.invoicesCronService.updateStatusInvoiceCronJob(handlebyRequest);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Get('/code/:invoiceCode')
  findByCode(@Param('invoiceCode') invoice: string, @Headers() headers) {
    return this.invoicesService.findByCode(invoice, headers);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Patch(':id/update-status')
  updateStatus(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updateInvoiceStatusDto: UpdateInvoiceStatusDto,
    @Headers() headers: any,
  ) {
    return this.invoicesService.updateStatus(
      +id,
      req,
      updateInvoiceStatusDto,
      headers,
    );
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Query() searchInvoiceDto: SearchInvoiceDto,
    @Headers() headers: any,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.findAll(pagination, searchInvoiceDto, headers, req);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers: any,
    @Request() req: RequestWithUser,
  ) {
    return this.invoicesService.findOne(+id, pagination, headers, req);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    return this.invoicesService.update(
      +id,
      updateInvoiceDto,
      +req.user.userId,
      headers,
    );
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers: any) {
    return this.invoicesService.remove(+id, headers);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Patch('/update-code/:id')
  updateCode(
    @Param('id') id: string,
    @Body() updateInvoiceName: UpdateInvoiceNameDto,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    return this.invoicesService.updateName(
      +id,
      updateInvoiceName,
      +req.user.userId,
      headers,
    );
  }
}
