import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateStatusTaskDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  statusId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  position: number;

}
