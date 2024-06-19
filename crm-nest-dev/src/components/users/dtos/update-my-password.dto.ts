import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../../common/decorators/match.decorator';
import { MIN_CHARACTER } from 'src/constants';

export class UpdateMyPassword {
  @MinLength(MIN_CHARACTER)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'QI@12345' })
  oldPassword: string;

  @MinLength(MIN_CHARACTER)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'QI@12345' })
  password: string;

  @IsString()
  @Match('password')
  @IsNotEmpty()
  @ApiProperty({ example: 'QI@12345' })
  confirm_password: string;
}
