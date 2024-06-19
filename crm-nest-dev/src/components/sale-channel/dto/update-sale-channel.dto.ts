import { PartialType } from '@nestjs/swagger';
import { CreateSaleChannelDto } from './create-sale-channel.dto';

export class UpdateSaleChannelDto extends PartialType(CreateSaleChannelDto) {}
