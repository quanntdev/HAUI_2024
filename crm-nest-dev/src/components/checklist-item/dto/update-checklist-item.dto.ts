import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateChecklistItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Checklist Title' })
  title: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  isDone: number;
}
