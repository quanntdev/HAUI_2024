import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserSignedGuard } from '../../common/guards/user';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationQuery } from '../../common/dtos/pagination';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('api/categories')
@UseGuards(UserSignedGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req: any) {
    return this.categoriesService.create(createCategoryDto, req);
  }

  @Get()
  findAll(@Query() pagination: PaginationQuery) {
    return this.categoriesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
