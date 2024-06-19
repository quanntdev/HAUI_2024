import { PartialType } from '@nestjs/swagger';
import { CreateBillingTypeDto } from './create-billing-type.dto';

export class UpdateBillingTypeDto extends PartialType(CreateBillingTypeDto) {}
