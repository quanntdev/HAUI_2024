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
  Req,
  Query,
} from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from '../../common/guards/user';
import { RequestWithUser } from 'src/common/interfaces';

@ApiTags('Industry')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Post()
  create(
    @Body() body: CreateIndustryDto,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.industriesService.create(body, headers, req);
  }

  @Get()
  findAll(@Query() pagination: any) {
    return this.industriesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.industriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.industriesService.update(+id, updateIndustryDto, headers, req);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.industriesService.remove(+id, headers, req);
  }
}
