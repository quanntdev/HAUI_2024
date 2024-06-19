import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CheckDateInvoice } from 'src/common/validatorContraints';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { CreateInvoiceOrderItemDto } from '../../invoice-order-items/dto/create-invoice-order-item.dto';

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  invoice_category_id: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  VAT: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-11-11' })
  start_date: Date;

  @Validate(CheckDateInvoice)
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-11-11' })
  due_date: Date;

  @IsNotEmpty()
  @ApiProperty({ type: [CreateInvoiceOrderItemDto] })
  @Type(() => CreateInvoiceOrderItemDto)
  @ValidateNested({ each: true })
  order_items: CreateInvoiceOrderItemDto[];
}
