import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { CheckDateGreaterStartDate } from 'src/common/validatorContraints';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'lam web' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  priorityId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1, 2, 3' })
  usersId: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  statusId: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-11-11' })
  startDate: Date;

  @IsDateString()
  @Validate(CheckDateGreaterStartDate)
  @IsOptional()
  @ApiProperty({ example: '2022-11-11' })
  dueDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  description: string;

  @IsOptional()
  @ApiProperty({ example: 0 })
  isArchived: number = 0;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  isPublic: number;
}
