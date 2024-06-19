import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';
import { CheckDateGreaterStartDate } from 'src/common/validatorContraints/checkDateGreaterStartDate';
import { CheckLengthReview } from 'src/common/validatorContraints/checkLengthReview';

export class UpdateOrderDto {
  @IsNotEmpty()
  @Validate(CheckLengthReview)
  @ApiProperty({ example: 'Order' })
  name: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  startDate: Date;

  @Validate(CheckDateGreaterStartDate)
  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  dueDate: Date;

  @Validate(CheckDateGreaterStartDate)
  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-01-01' })
  deleveryDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Phan Huu Kien' })
  orderManager: string;

  @Validate(CheckLengthReview)
  @IsOptional()
  @ApiProperty({ example: 'Review' })
  review: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  @ApiProperty({ example: 8 })
  ratePoint: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  billingTypeId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  currencyId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: '100,100.02' })
  orderValue: string;

  @IsOptional()
  @Validate(IsNumberText)
  @ApiProperty({ example: 1 })
  categoryId: number;

  @IsOptional()
  @Validate(IsNumberText)
  @ApiProperty({ example: 1 })
  contactId: number;

  @IsOptional()
  @Validate(IsNumberText)
  @ApiProperty({ example: 1 })
  userAssignId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  partnerSalePercent: number;
}
