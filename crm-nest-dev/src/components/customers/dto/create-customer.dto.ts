import { CheckPartnerId } from './../../../common/validatorContraints/validatePartner/checkPartnerId';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { CheckURL } from 'src/common/validatorContraints';
import { CheckIsEmail } from 'src/common/validatorContraints/checkIsEmail';
import {
  IsCiD,
  IsNumberText,
} from 'src/common/validatorContraints/isNumberText';
import { CheckPartnerType } from 'src/common/validatorContraints/validatePartner/checkPartnerType';
import { CheckDateTimePartner } from 'src/common/validatorContraints/validatePartner/checkDateTimePartner';
import { CheckEndDate } from 'src/common/validatorContraints/validatePartner/checkEndDate';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { CheckFaxPhone } from 'src/common/validatorContraints/customeValidate/checkFaxPhone';

export class CreateCustomerDto {
  @IsString()
  @Validate(IsNotEmptyValidate)
  @ApiProperty({ example: 'name' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'subName' })
  subName: string;


  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  industryId: number;

  @Validate(CheckFaxPhone)
  @IsOptional()
  @ApiProperty({ default: '0912345670', required: false })
  phone: string;

  @Validate(CheckFaxPhone)
  @IsOptional()
  @ApiProperty({ example: '12345' })
  fax: string;

  @IsOptional()
  @ApiProperty({ example: '2022-02-10' })
  esTabLishMent: Date;

  @IsString()
  @Validate(CheckURL)
  @IsOptional()
  @ApiProperty({ example: 'http://test.com' })
  website: string;

  @Validate(CheckIsEmail)
  @IsOptional()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: 1 })
  currencyId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  employeeId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Duong Dinh Nghe' })
  address: string;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  cityId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  levelId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  channelId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  description: string = "No Description's Content";

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  countryId: number;

  @Validate(IsCiD)
  @IsOptional()
  @ApiProperty({ example: 1 })
  cidCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1 Bilion' })
  capital: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'JA0111' })
  postalCode: string;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  assignedId: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1 })
  priorityId: number;

  @IsOptional()
  @ApiProperty({type:"file", format:"binary", required: false})
  attachment: []

  @Validate(IsNumberText)
  @Validate(CheckPartnerId)
  @IsOptional()
  @ApiProperty({ example: 1 , required: false})
  partnerId: number;

  @Validate(IsNumberText)
  @Validate(CheckPartnerType)
  @ApiProperty({ example: 1 , required: false})
  partnerSaleType: number;

  @Validate(IsNumberText)
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  partnerSalePercent: number;

  @Validate(CheckPartnerType)
  @Validate(CheckDateTimePartner)
  @IsOptional()
  @ApiProperty({ example: '2022-11-11', required: false })
  saleStartDate: Date;

  @Validate(CheckPartnerType)
  @Validate(CheckDateTimePartner)
  @Validate(CheckEndDate)
  @IsOptional()
  @ApiProperty({ example: '2022-11-12', required: false })
  saleEndDate: Date;

  lang: string
}
