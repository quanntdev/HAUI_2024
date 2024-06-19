import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNewUser } from './users.dto';
import { Match } from 'src/common/decorators/match.decorator';
import { IsMinLengthCustom } from '../../../common/validatorContraints/IsMinLengthCustom';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';


export class UpdateUsers extends CreateNewUser {
   @Validate(IsNotEmptyValidate)
  @IsString()
  @Validate(CheckIsEmail)
  @ApiProperty({ example: 'admin@QI-solution.com' })
  email: string;

  @Validate(IsMinLengthCustom)
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'QI@12345' })
  password: string;

  @Validate(IsMinLengthCustom)
  @IsString()
  @IsOptional()
  @Match('password')
  @ApiProperty({ example: 'QI@12345' })
  confirm_password: string;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2, 3])
  @ApiProperty({ example: 1 })
  role: number;

  lang:string;
}
