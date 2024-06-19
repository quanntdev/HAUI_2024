import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, Validate } from "class-validator";
import { CheckDateGreaterStartDate } from "src/common/validatorContraints";

export class UpdateInvoicePartnerDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-11-11' })
  startDate: Date;

  @IsDateString()
  @Validate(CheckDateGreaterStartDate)
  @IsOptional()
  @ApiProperty({ example: '2022-11-11' })
  dueDate: Date;

  @IsOptional()
  @ApiProperty({ example: 1 })
  VAT: number;
}