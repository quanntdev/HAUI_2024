import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  statusId: number;
}
