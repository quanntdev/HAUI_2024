import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class CreatePaymentDto {
  @IsOptional()
  @ApiProperty({ example: 1 })
  invoiceId: number;

  @IsOptional()
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  customerId: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  orderId: number;

  @IsOptional()
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  currencyId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Transaction Id' })
  transactionId: string;

  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  methodId: number;

  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1.02 })
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-11-11' })
  paymentDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Notes description' })
  notes: string = "No Description's Content";

  @IsOptional()
  @ApiProperty({type:"file", format:"binary"})
  attachment: string

  lang:string
}
