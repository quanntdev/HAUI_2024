import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLogNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'deals' })
  object: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 1 })
  objectId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 1 })
  action: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Comments' })
  comment: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '👍' })
  emoji: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1, 2, 3' })
  usersId: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 1 })
  note_id: number;
}
