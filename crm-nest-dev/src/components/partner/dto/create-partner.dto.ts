import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {CheckURL } from 'src/common/validatorContraints';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';

export class CreatePartnerDto {
  @IsString()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: "Dev Nguyen Sutor" })
  name: string;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ default: '0912345670', required: false })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '12345' })
  fax: string;

  @IsString()
  @Validate(CheckURL)
  @IsOptional()
  @ApiProperty({ example: 'http://test.com' })
  website: string;

  @Validate(CheckIsEmail)
  @IsOptional()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Duong Dinh Nghe' })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  description: string = "No Description's Content";

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  assignedId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  priorityId: number;
}
