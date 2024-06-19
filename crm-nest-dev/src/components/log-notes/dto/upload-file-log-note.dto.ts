import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'deals' })
  object: string;

  @IsOptional()
  @ApiProperty({ example: 1 })
  objectId: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  action: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsOptional()
  @ApiProperty({type:"file", format:"binary"})
  attachment: string
}

export class UploadFileRawDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'deals' })
  object: string;

  @IsOptional()
  @ApiProperty({ example: 1 })
  objectId: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  action: number;

  @IsOptional()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsOptional()
  @ApiProperty({type:"file"})
  attachment: string
}
