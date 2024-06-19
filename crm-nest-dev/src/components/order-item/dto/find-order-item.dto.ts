import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';

export class FindOrderItemDto {
  @ApiProperty({
    required: false,
    example: 1,
  })
  @Validate(IsNumberText)
  @IsOptional()
  statusId: number;
}
