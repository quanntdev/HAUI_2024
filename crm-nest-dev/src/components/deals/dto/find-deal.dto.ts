import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';
import { IsDateString } from 'src/common/validatorContraints';
import { IsStringValidate } from 'src/common/validatorContraints/customeValidate/isString';

export class FindDealDto {
  @ApiProperty({
    required: false,
    example: 'kanban',
  })
  @Validate(IsStringValidate)
  @IsOptional()
  type: string;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @Validate(IsNumberText)
  @IsOptional()
  statusId: number;

  @ApiProperty({
    required:false,
    example: '1',
  })
  @Validate(IsNumberText)
  @IsOptional()
  customerId: number;

  @ApiProperty({
    required:false,
    example: '1',
  })
  @Validate(IsNumberText)
  @IsOptional()
    currencyId: number;

  @ApiProperty({
    required:false,
    example: 1000,
  })
  @Validate(IsStringValidate)
  @IsOptional()
    valueFrom: string;

  @ApiProperty({
    required:false,
    example: 4000,
  })
  @Validate(IsStringValidate)
  @IsOptional()
    valueTo: string;

  @ApiProperty({
    required:false,
    example: '1',
  })
  @Validate(IsNumberText)
  @IsOptional()
    categoryId: number;

  @ApiProperty({
    required:false,
    example: '2022-11-20',
  })
  @Validate(IsDateString)
  @IsOptional()
    startTime: Date;

  @ApiProperty({
    required:false,
    example: '2023-11-20',
  })
  @Validate(IsDateString)
  @IsOptional()
    endTime: Date;

   @ApiProperty({
    required:false,
    example: '1,2,3,4,5',
  })
  @IsOptional()
    listStatus: string;
}
