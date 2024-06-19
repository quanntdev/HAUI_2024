import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCardimageDto {
  @ApiProperty({ required: false, type: 'file', format: 'binary' })
  @IsOptional()
  cardImage: string;
}

export class UpdateContactAvatarDto {
  @ApiProperty({ required: false, type: 'file', format: 'binary' })
  @IsOptional()
  avatar: string;
}
