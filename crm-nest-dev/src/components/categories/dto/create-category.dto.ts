import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ example: 'test' })
  name: string
}
