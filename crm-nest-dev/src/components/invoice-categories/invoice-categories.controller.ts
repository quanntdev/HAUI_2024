import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InvoiceCategoriesService } from './invoice-categories.service';
import { CreateInvoiceCategoryDto } from './dto/create-invoice-category.dto';
import { UpdateInvoiceCategoryDto } from './dto/update-invoice-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from '../../common/guards/user';

@ApiTags('InvoiceCategory')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/invoice-categories')
export class InvoiceCategoriesController {
  constructor(private readonly invoiceCategoriesService: InvoiceCategoriesService) { }

  @Post()
  create(@Body() createInvoiceCategoryDto: CreateInvoiceCategoryDto) {
    return this.invoiceCategoriesService.create(createInvoiceCategoryDto);
  }

  @Get()
  findAll() {
    return this.invoiceCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceCategoryDto: UpdateInvoiceCategoryDto) {
    return this.invoiceCategoriesService.update(+id, updateInvoiceCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceCategoriesService.remove(+id);
  }
}
