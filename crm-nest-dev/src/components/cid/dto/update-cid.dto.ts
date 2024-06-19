import { PartialType } from '@nestjs/swagger';
import { CreateCidDto } from './create-cid.dto';

export class UpdateCidDto extends PartialType(CreateCidDto) {}
