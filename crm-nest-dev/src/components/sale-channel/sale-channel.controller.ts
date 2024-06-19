import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SaleChannelService } from './sale-channel.service';
import { CreateSaleChannelDto } from './dto/create-sale-channel.dto';
import { UserSignedGuard } from '../../common/guards/user';

@ApiTags('Sale Channel')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/sale-channel')
export class SaleChannelController {
  constructor(private readonly saleChannelService: SaleChannelService) {}

  @Post()
  create(
    @Body() createSaleChannelDto: CreateSaleChannelDto,
    @Headers() headers,
  ) {
    return this.saleChannelService.create(createSaleChannelDto, headers);
  }

  @Get()
  findAll(
    @Query() pagination: any,
  ) {
    return this.saleChannelService.findAll(pagination);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Headers() headers,) {
    return this.saleChannelService.remove(+id,headers);
  }
}
