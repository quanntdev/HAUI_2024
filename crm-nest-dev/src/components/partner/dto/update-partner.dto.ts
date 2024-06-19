import { PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';

export class UpdatepartnerDto extends PartialType(CreatePartnerDto) {}
