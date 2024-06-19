import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';
import { IsDateString } from 'src/common/validatorContraints';

export class SearchInvoiceDto {

  @ApiProperty({
    required: false,
    example: 'Test',
  })
  keyword: string;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  statusId: number

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  notInStatus: number

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  orderId: number

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  customerId: number

  @Validate(IsNumberText)
  @IsOptional()
    currencyId: number;

  @ApiProperty({
    required:false,
    example: 1000,
  })
  @IsString()
  @IsOptional()
    valueFrom: string;

  @ApiProperty({
    required:false,
    example: 4000,
  })
  @IsString()
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
}
