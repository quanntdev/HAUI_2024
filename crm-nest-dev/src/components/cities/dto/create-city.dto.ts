import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'HaNoi , Ninh Binh , Quang Ngai' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'VN' })
  countryCode: string;
}
