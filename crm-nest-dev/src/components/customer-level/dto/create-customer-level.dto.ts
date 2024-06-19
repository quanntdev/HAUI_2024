import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsStringValidate } from 'src/common/validatorContraints/customeValidate/isString';

export class CreateCustomerLevelDto {
  @IsString()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'Level' })
  name: string;

  @Validate(IsStringValidate)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  @Validate(IsNotEmptyValidate)
  description: string = "No Description's Content";
  lang: any;
}
