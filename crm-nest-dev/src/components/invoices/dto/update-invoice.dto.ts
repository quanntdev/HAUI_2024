import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateInvoiceDto } from './create-invoice.dto';
import { CreateInvoiceOrderItemDto } from '../../invoice-order-items/dto/create-invoice-order-item.dto';
import { Type } from 'class-transformer';
import { UpdateInvoiceOrderItemDto } from '../../invoice-order-items/dto/update-invoice-order-item.dto';

export class UpdateInvoiceDto extends OmitType(CreateInvoiceDto, ['order_id', 'order_items','invoice_category_id']) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test' })
  customer_name: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1 })
  country_id: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1 })
  province_id: number

  @IsString()
  @ApiProperty({ example: 'test' })
  postal_code: string

  @IsString()
  @ApiProperty({ example: 'test' })
  address: string

  @IsNotEmpty()
  @ApiProperty({ type: [UpdateInvoiceOrderItemDto] })
  @Type(() => CreateInvoiceOrderItemDto)
  @ValidateNested({ each: true })
  invoice_order_items: UpdateInvoiceOrderItemDto[];

  lang:string;
}

export class UpdateInvoiceStatusDto {
  @IsNumber()
  @ApiProperty({ example: 2 })
  status: number
}


export class UpdateInvoiceNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test' })
  code: string
}
