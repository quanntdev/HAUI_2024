import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSaleChannelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Zalo' })
  name: string;
}
