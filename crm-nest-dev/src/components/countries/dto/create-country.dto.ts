import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCountryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'name' })
    name: string;
}
