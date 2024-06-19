import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from '../../common/guards/user';
import { PaginationQuery } from 'src/common/dtos';

@ApiTags('Tag')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  create(@Body() createTagDto: CreateTagDto, @Request() req: any) {
    return this.tagsService.create(createTagDto, req);
  }

  @Get()
  findAll(@Query() pagination: PaginationQuery) {
    return this.tagsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
