import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,

} from 'class-validator';

export class AutoCreateLogNotesDto {
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
  @ApiProperty({ example: 'JSONData' })
  oldValue: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'JSONData' })
  newValue: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Comments' })
  comment: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 1 })
  userId: number;
}
