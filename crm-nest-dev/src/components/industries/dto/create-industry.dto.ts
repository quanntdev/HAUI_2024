import { ApiProperty } from "@nestjs/swagger";
import { IsString, Validate } from "class-validator";
import { IsNotEmptyValidate } from "src/common/validatorContraints/customeValidate/isNotEmpty";

export class CreateIndustryDto {
     @IsString()
     @Validate(IsNotEmptyValidate)
     @ApiProperty({ example: 'Name' })
     name: string;
}
