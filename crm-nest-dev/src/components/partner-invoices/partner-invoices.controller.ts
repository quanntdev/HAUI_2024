import { PaginationQuery } from 'src/common/dtos';
import { PartnerInvoicesService } from './partner-invoices.service';
import { Controller, Get, Param, Query, Headers, UseGuards, Request, Patch, Body, Req } from '@nestjs/common';
import { UserSignedGuard } from 'src/common/guards/user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/interfaces';
import { UpdateInvoiceNameDto, UpdateInvoiceStatusDto } from '../invoices/dto/update-invoice.dto';
import { SearchInvoiceDto } from '../invoices/dto/search-invoice.dto';
import { UpdateInvoicePartnerDto } from './dto/updateInvoicePartner.dto';

@ApiTags('Partner-Invoice')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/partner-invoices')
export class PartnerInvoicesController {
  constructor(
    private readonly partnerInvoicesService: PartnerInvoicesService
  ){}

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
  ) {
    return this.partnerInvoicesService.findOne(+id, pagination,headers);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Request() req: RequestWithUser,
    @Query() searchInvoiceDto: SearchInvoiceDto
    ) {
    return this.partnerInvoicesService.findAll(pagination, req, searchInvoiceDto);
  }

  @Patch('/update-code/:id')
  updateCode(
    @Param('id') id: string,
    @Body() updateInvoiceName: UpdateInvoiceNameDto,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    return this.partnerInvoicesService.updateName(
      +id,
      updateInvoiceName,
      +req.user.userId,
      headers,
    );
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateInvoicePartnerDto,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    return this.partnerInvoicesService.update(
      +id,
      body,
      +req.user.userId,
      headers,
    );
  }

  @Patch(':id/update-status')
  updateStatus(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updateInvoiceStatusDto: UpdateInvoiceStatusDto,
    @Headers() headers: any,
  ) {
    return this.partnerInvoicesService.updateStatus(
      +id,
      req,
      updateInvoiceStatusDto,
      headers,
    );
  }

  @Get('/invoice-partner-order/:id')
  getOrderOfPartner(@Param('id') id: string,  @Headers() Headers, @Query() pagination: any,) {
    return this.partnerInvoicesService.getInvoicePartnerOfOrder(+id, Headers, pagination)
  }
}
