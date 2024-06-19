import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Order Title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '20' })
  estimateHour: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  completedDate: Date;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: '100,100.02' })
  unitPrice: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1 })
  statusId: number;
}
