import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateChecklistDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Checklist Title' })
  title: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  isDone: number;
}
