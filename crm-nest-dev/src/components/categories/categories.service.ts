import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities';
import { Brackets, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { SUCCESS_CODES } from '../../constants/successCodes';
import { PaginationQuery, PaginationResponse } from '../../common/dtos/pagination';
import { ERROR_CODES } from '../../constants/errorCodes';
import { DEFAULT_LIMIT_PAGINATE } from 'src/constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto, req: any) {
    try {
      const category = this.categoryRepository.create({
        ...createCategoryDto,
        user: req.user.userId
      })
      await this.categoryRepository.save(category)

      return {
        message: SUCCESS_CODES.CREATE_SUCCESSFULLY,
        data: category
      }
    } catch (e) {
      checkMysqlError(e)
    }
  }

  async findAll(pagination: PaginationQuery) {
    try {
      const { offset, limit = DEFAULT_LIMIT_PAGINATE, keyword } = pagination
      const data = this.categoryRepository
        .createQueryBuilder()
        .skip(offset)
        .take(limit)

      if (!!keyword) {
        data.andWhere(new Brackets(q => {
          q.where('categories.name LIKE :keyword', { keyword: `%${keyword}%` })
        }))
      }

      const [category, count] = await data.getManyAndCount()
      return {
        data: new PaginationResponse<any>(category, count),
      }
    } catch (e) {
      checkMysqlError(e)
    }
  }

  async findOne(id: number) {
    try {
      return {
        data: await this.categoryRepository.findOne({ where: { id } }),
      }
    } catch (e) {
      checkMysqlError(e)
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, updateCategoryDto)
      const category = await this.categoryRepository.findOne({ where: { id } })
      return {
        data: category,
        message: SUCCESS_CODES.UPDATE_SUCCESSFULLY
      }
    } catch (e) {
      checkMysqlError(e)
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } })
      if (!category) {
        throw new NotFoundException(ERROR_CODES.DATA_NOT_FOUND)
      }

      this.categoryRepository.delete(id)
      return {
        data: {},
        message: SUCCESS_CODES.DELETE_SUCCESSFULLY
      }
    } catch (e) {
      checkMysqlError(e)
    }
  }
}
