import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SystemSetting {
  @IsOptional()
  @ApiProperty({type:"file", format:"binary"})
  logo: string
}
