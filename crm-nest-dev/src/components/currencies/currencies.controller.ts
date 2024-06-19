import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { UserSignedGuard } from '../../common/guards/user';

@ApiTags('Currency')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/currencies')
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    ) {}

  // @Post()
  // create(@Body() createCurrencyDto: CreateCurrencyDto) {
  //   return this.currenciesService.create(createCurrencyDto);
  // }

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.currenciesService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateCurrencyDto: UpdateCurrencyDto,
  //   ) {
  //     return this.currenciesService.update(+id, updateCurrencyDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.currenciesService.remove(+id);
  //   }
}
