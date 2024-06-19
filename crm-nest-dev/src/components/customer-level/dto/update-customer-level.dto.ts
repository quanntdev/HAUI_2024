import { PartialType } from '@nestjs/swagger';
import { CreateCustomerLevelDto } from './create-customer-level.dto';

export class UpdateCustomerLevelDto extends PartialType(CreateCustomerLevelDto) {}
