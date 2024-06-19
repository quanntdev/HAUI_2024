import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateLogNoteDto } from './create-log-note.dto';

export class UpdateLogNoteDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Comments' })
  comment: string;
}
