import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { CheckURL } from 'src/common/validatorContraints';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsStringValidate } from 'src/common/validatorContraints/customeValidate/isString';
import { IsDateStringOrEmpty } from 'src/common/validatorContraints/isDateOrEmptyString';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class CreateDealDto {
  @Validate(IsNotEmptyValidate)
  @IsString()
  @ApiProperty({ example: 'Deal' })
  name: string;

  @Validate(IsNumberText)
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: '1' })
  customerId: number;

  @Validate(CheckURL)
  @IsOptional()
  @ApiProperty({ example: 'http://test.com' })
  url: string;

  @IsOptional()
  @Validate(IsNumberText)
  @ApiProperty({ example: 1 })
  contactId: number;

  @IsOptional()
  @Validate(IsNumberText)
  @ApiProperty({ example: 1 })
  categoryId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 80 })
  probabilityWinning: number;

  @Validate(IsDateStringOrEmpty)
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  forecastCloseDate: string;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  userAssignId: number;

  @Validate(IsNotEmptyValidate)
  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  currencyId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: '100,100.02' })
  price: string;

  @Validate(IsStringValidate)
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  description: string = "No Description's Content";

  @Validate(IsStringValidate)
  @IsOptional()
  @ApiProperty({ example: '1,3,4' })
  tagId: string;

  @ApiProperty({ example: 1 })
  @Validate(IsNumberText)
  @IsOptional()
  statusId: number;

  lang:string
}
