import { InvoicesService } from './../invoices/invoices.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Headers,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserSignedGuard } from '../../common/guards/user';
import { PaginationQuery } from '../../common/dtos';
import { DealsService } from '../deals/deals.service';
import { OrderService } from '../order/order.service';
import { ContactService } from '../contacts/contacts.service';
import { FindOrderDto } from '../order/dto/find-order.dto';
import { FindDealDto } from '../deals/dto/find-deal.dto';
import { LogNotesService } from '../log-notes/log-notes.service';
import { RequestWithUser } from 'src/common/interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileRaw } from 'src/common/uploadImageHelper/file-helper';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('api/customers')
@UseGuards(UserSignedGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly dealService: DealsService,
    private readonly orderService: OrderService,
    private readonly contactService: ContactService,
    private readonly logNotesService: LogNotesService,
    private readonly invoiceService: InvoicesService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw))
  @ApiConsumes('multipart/form-data')
  async create(
    @BodyWithMiddleware() createCustomerDto: CreateCustomerDto,
    @Request() req: RequestWithUser,
    @Headers() headers,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
  ) {
    if (attachment.length == 0) {
      return await this.customersService.create(
        createCustomerDto,
        req,
        headers,
      );
    }

    return await this.customersService.create(
      createCustomerDto,
      req,
      headers,
      attachment,
    );
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Request() req: RequestWithUser,
  ) {
    return this.customersService.findAll(pagination, req);
  }

  @Get('/get-short-data')
  findNameAndID(
    @Query() pagination: PaginationQuery,
    @Request() req: RequestWithUser,
  ) {
    return this.customersService.findNameAndID(pagination, req);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
    @Request() req: RequestWithUser,
  ) {
    return this.customersService.findOne(+id, pagination, headers, req);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @BodyWithMiddleware() updateCustomerDto: UpdateCustomerDto,
    @Request() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.customersService.update(+id, updateCustomerDto, req, headers);
  }

  @Put(':id/merge')
  mergeCustomer(
    @Param('id') id: string,
    @BodyWithMiddleware() body: any,
    @Request() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.customersService.mergeCustomer(id, body, req,headers);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers) {
    return this.customersService.remove(+id, headers);
  }

  @Get(':id/contacts')
  findAllContactByCustomerId(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.contactService.findByCustomerId(+id, pagination);
  }

  @Get(':id/orders-invoice')
  findOrderHasInvoiceByCustomerId(@Param('id') id: string) {
    return this.orderService.findByCustomerIdAndCreatePayment(+id);
  }

  @Get(':id/customer-invoice')
  findInvoiceById(@Param('id') id: string) {
    return this.invoiceService.findInvoiceByCustomerId(+id);
  }

  @Get(':id/orders')
  findAllOrderByCustomerId(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Query() query: FindOrderDto,
  ) {
    return this.orderService.findByCustomerId(+id, pagination, query.statusId);
  }

  @Get(':id/deals')
  findAllDealItemsByOrderId(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Query() query: FindDealDto,
  ) {
    return this.dealService.findByCustomerId(+id, pagination, query.statusId);
  }

  @Get(':countryId/generate-cid')
  generateCid(@Param('countryId') countryId: string) {
    return this.customersService.generateCid(+countryId);
  }
}
