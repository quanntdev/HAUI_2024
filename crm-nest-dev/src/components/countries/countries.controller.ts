import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { UserSignedGuard } from '../../common/guards/user';
import { PaginationQuery } from 'src/common/dtos';

@ApiTags('Country')
// @ApiBearerAuth()
// @UseGuards(UserSignedGuard)
@Controller('api/countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  create(@Body() createCountryDto: CreateCountryDto, @Headers() headers) {
    return this.countriesService.create(createCountryDto,headers);
  }

  @Get()
  findAll(@Query() pagination: PaginationQuery) {
    return this.countriesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers) {
    return this.countriesService.remove(+id,headers);
  }
}
