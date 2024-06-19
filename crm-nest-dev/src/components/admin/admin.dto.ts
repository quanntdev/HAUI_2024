import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDataWithIdParams {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: 1 })
  id: number;
}

export class CreateNewBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'QI-solution' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin@qi-solution.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'QI@12345' })
  password: string;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  @ApiProperty({ example: 1 })
  status: number;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  @ApiProperty({ example: 1 })
  role: number;
}
