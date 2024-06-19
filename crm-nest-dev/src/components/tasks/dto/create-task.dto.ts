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
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'lam web' })
  name: string;

  @Validate(IsNumberText)
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
  description: string = "No Description's Content";

  @IsOptional()
  @ApiProperty({ example: 0 })
  isArchived: number = 0;

  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  isPublic: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1, 2, 3' })
  customerId: string;

  @IsString()
  @IsOptional()
  orderId: string;

  @IsString()
  @IsOptional()
  invoiceId: string;

  @IsString()
  @IsOptional()
  dealId: string;

  lang: string;
}
