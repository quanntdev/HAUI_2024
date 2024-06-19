import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { CheckDateGreaterStartDate } from 'src/common/validatorContraints/checkDateGreaterStartDate';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'Order' })
  name: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  startDate: Date;

  @Validate(CheckDateGreaterStartDate)
  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  dueDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Phan Huu Kien' })
  orderManager: string;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  billingTypeId: number;


  @Validate(IsNumberText)
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  dealId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  userAssignId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: '100,100.02' })
  orderValue: string;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  currencyId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  description: string = "No Description's Content";

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  partnerSalePercent: number;

  lang:string
}
