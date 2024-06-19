import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateInvoiceOrderItemDto } from './create-invoice-order-item.dto';

export class UpdateInvoiceOrderItemDto extends OmitType(CreateInvoiceOrderItemDto, ['order_item_id']) {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number
}
