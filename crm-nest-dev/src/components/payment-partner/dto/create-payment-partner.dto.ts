import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';

export class CreatePaymentPartnerDto {
  @IsNotEmpty()
  @IsOptional()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  invoicePartnerId: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  currencyId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Transaction Id' })
  transaction: string;

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

  lang: string;
}

export class CreatePaymentManyInvoiceDTO {
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: '1, 2, 3' })
  invoicePartnerIds: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Transaction Id' })
  transaction: string;

  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  methodId: number;

  @IsOptional()
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  orderId: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-11-11' })
  paymentDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Notes description' })
  notes: string = "No Description's Content";

  lang:string
}
