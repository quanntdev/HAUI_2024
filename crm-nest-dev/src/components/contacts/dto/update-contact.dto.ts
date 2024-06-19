
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class UpdateContactDto {

  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @IsString()
  @ApiProperty({ default: 'First name' })
  firstName: string;

  @IsString()
  @ApiProperty({ default: 'Last name' })
  lastName: string;

  //@IsEmail()
  @IsOptional()
  @Validate(CheckIsEmail)
  @ApiProperty({ example: 'email@qi-solution.com', required: false })
  email: any;


  @IsOptional()
  @ApiProperty({ example: 1 })
  gender: number;


  @Validate(IsNumberText)
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
  avatar: string;

  @ApiProperty({ required: false, type: 'file', format: 'binary' })
  cardImage: string;
}
