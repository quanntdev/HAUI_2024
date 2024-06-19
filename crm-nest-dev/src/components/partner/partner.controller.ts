import { Body, Controller, Post, Request, Headers, UseGuards, Get, Query, Param, Delete, Put } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { RequestWithUser } from 'src/common/interfaces';
import { PaginationQuery } from 'src/common/dtos';
import { UpdatepartnerDto } from './dto/update-partner.dto';

@ApiTags('Partner')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/partner')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService
  ) {}

  @Post()
  async create(
    @Body() createPartnerDto : CreatePartnerDto,
    @Request() req: RequestWithUser,
    @Headers() headers,
  ) {
    return await this.partnerService.create(createPartnerDto, req, headers)
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQuery,
    @Request() req: RequestWithUser,
    ) {
    return this.partnerService.findAll(pagination, req);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() Headers,
    @Request() req: RequestWithUser,
    ) {
    return this.partnerService.findOne(+id, pagination,Headers, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers: any) {
    return this.partnerService.remove(+id, headers);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatepartnerDto,
    @Request() req: RequestWithUser,
    @Headers() Headers,
  ) {
    return this.partnerService.update(+id, updatePartnerDto, req, Headers);
  }

  @Get("/contract/:id")
  getContract(
    @Param('id') id: string,
    @Query() pagination: PaginationQuery,
    @Headers() Headers,
    @Request() req: RequestWithUser,
  ) {
    return this.partnerService.getContract(+id, pagination,Headers, req)
  }
}
