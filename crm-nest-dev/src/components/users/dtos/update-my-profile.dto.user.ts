import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsNumber,
  IsIn,
  IsEmail,
  IsBoolean,
  IsDateString,
  Validate,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../../common/decorators/match.decorator';
import {
  IsDateLessThanNow,
  IsNotNumberIsSpecial,
  CheckDateOfJoining,
} from 'src/common/validatorContraints';
import { MIN_CHARACTER } from 'src/constants';
import { IsDateStringOrEmpty } from 'src/common/validatorContraints/isDateOrEmptyString';

export class UpdateMyProfileDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'QI' })
  first_name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'QI' })
  last_name: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  gender: boolean;

  @Validate(IsDateStringOrEmpty)
  @ApiProperty({ example: '2016-10-14' })
  birth_of_date: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'admin@qi-solution.com' })
  email: string;

  @IsOptional()
  @IsOptional()
  @ApiProperty({ example: '0987654321' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'QI' })
  address: string;

  @ApiProperty({ required: false, type: 'file', format: 'binary' })
  @IsOptional()
  profileImg: string;
}
