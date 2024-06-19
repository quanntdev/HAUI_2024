import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceCategoryDto } from './create-invoice-category.dto';

export class UpdateInvoiceCategoryDto extends PartialType(CreateInvoiceCategoryDto) {}
