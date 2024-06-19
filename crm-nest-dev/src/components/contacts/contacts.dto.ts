import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumberString, IsOptional, IsString} from "class-validator";

export class GetDataWithIdParams {
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({ example: 1 })
    id: number;
}

export class CreateNewBody {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({default: "First name"})
    first_name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({default: "Last name"})
    last_name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'email@qi-solution.com' })
    email: string

    @IsOptional()
    @ApiProperty({ example: 1 })
    gender: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({default: "091234567"})
    phone: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({default: "091234567"})
    mobile_phone: string

    @ApiProperty({required: false})
    note: string

    @ApiProperty({required: false, type:"file", format:"binary"})
    avatar: string
}
