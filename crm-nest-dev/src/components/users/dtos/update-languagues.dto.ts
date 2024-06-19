import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateLanguages {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'vi' })
  languages: string;
}
