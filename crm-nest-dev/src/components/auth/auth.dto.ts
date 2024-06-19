import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { IsMinLengthCustom } from "src/common/validatorContraints";

export class AuthLoginBody {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@qi-solutions.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345678' })
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  isRemember: number

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '12345678' })
  code: string;
}

export class AuthRefreshBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc' })
  refresh_token: string
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'QI@gmail.com' })
  email: string
}

export class ChangePasswordWithTokenDto {
  @Validate(IsMinLengthCustom)
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'QI@12345' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc' })
  reset_token: string
}