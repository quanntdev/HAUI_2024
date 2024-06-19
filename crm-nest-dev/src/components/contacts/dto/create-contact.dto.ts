import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  IsNumberString,
} from 'class-validator';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';
import { CheckFaxPhone } from 'src/common/validatorContraints/customeValidate/checkFaxPhone';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';

export class CreateContactDto {
  @Validate(IsNotEmptyValidate)
  @IsString()
  @ApiProperty({ default: 'First name' })
  firstName: string;

  @IsString()
  @ApiProperty({ default: 'Last name' })
  lastName: string;

  @Validate(CheckIsEmail)
  @IsOptional()
  @ApiProperty({ example: 'email@qi-solution.com'})
  email: string;

  @IsOptional()
  @ApiProperty({ example: 1 })
  gender: number;

  @Validate(CheckFaxPhone)
  @IsOptional()
  @ApiProperty({ default: '0912345670', required: false })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Sale', required: false })
  sector: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ example: '1,2,3', required: false })
  // tagId: string;

  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  customerId: number;

  @ApiProperty({ required: false, type: 'file', format: 'binary' })
  @IsOptional()
  cardImage: string;

  lang:string
}

export class CreateContactByCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'First name' })
  text: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'en' })
  lang: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ default: '1' })
  device: string;
}
