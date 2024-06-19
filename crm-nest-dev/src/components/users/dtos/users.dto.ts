import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsDateString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CheckDateOfJoining,
} from 'src/common/validatorContraints';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';
import { CheckLengthPassword } from 'src/common/validatorContraints/customeValidate/checkLengthPassword';
import { CheckSamePassword } from 'src/common/validatorContraints/customeValidate/checkSamePassword';
import { CheckRole } from 'src/common/validatorContraints/customeValidate/checkRole';

export class GetDataWithIdParams {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: 1 })
  id: number;
}

export class CreateNewUser {
  @Validate(IsNotEmptyValidate)
  @IsString()
  @Validate(CheckIsEmail)
  @ApiProperty({ example: 'admin@qi-solution.com' })
  email: string;

  @IsString()
  @Validate(IsNotEmptyValidate)
  @Validate(CheckLengthPassword)
  @ApiProperty({ example: 'QI@12345' })
  password: string;

  @IsString()
  @Validate(CheckSamePassword)
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'QI@12345' })
  confirm_password: string;

  @Validate(IsNotEmptyValidate)
  @Validate(CheckRole)
  @ApiProperty({ example: 1 })
  role: number;

  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'QI' })
  first_name: string;

  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'QI' })
  last_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '0987654321' })
  phone: string;

  @IsOptional()
  @ApiProperty({ example: '2016-10-14' })
  birth_of_date: string;

  @Validate(CheckDateOfJoining)
  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2016-10-14' })
  date_of_joining: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'QI' })
  address: string;

  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 1 })
  gender: boolean;
}
