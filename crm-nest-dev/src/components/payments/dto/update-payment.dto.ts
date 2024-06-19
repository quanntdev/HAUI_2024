import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class UpdatePaymentDto {
  @IsOptional()
  @ApiProperty({ example: 2 })
  invoiceId: number;

  @IsOptional()
  @ApiProperty({ example: 2 })
  currencyId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  customerId: number;

  @IsOptional()
  @ApiProperty({ example: 2 })
  orderId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  methodId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 1.02 })
  amount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Transaction Id' })
  transactionId: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-11-11' })
  paymentDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Notes description' })
  notes: string;

  @IsOptional()
  @ApiProperty({type:"file", format:"binary"})
  attachment: string
}
