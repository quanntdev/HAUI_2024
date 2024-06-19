import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceOrderItemDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  order_item_id: number | null;

  @IsString()
  @ApiProperty({ example: 'test' })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1.02 })
  value: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1.02 })
  tax_rate: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1.02 })
  total_value: number;
}
