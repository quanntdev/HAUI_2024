import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { SUCCESS_CODES } from '../../constants/successCodes';
import { PaginationQuery, PaginationResponse } from '../../common/dtos/pagination';
import { ERROR_CODES } from '../../constants/errorCodes';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { DEFAULT_LIMIT_PAGINATE } from 'src/constants';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) { }

  async create(createTagDto: CreateTagDto, req: any) {
    try {
      const tag = this.tagRepository.create({
        ...createTagDto,
        user: req.user.userId
      })
      await this.tagRepository.save(tag)

      return {
        data: tag,
        message: SUCCESS_CODES.CREATE_SUCCESSFULLY
      }
    } catch (error) {
      checkMysqlError(error)
    }
  }

  async findAll(pagination: PaginationQuery) {
    try {
      const { offset, limit = DEFAULT_LIMIT_PAGINATE, keyword } = pagination
      const data = this.tagRepository
        .createQueryBuilder('tags')
        .skip(offset)
        .take(limit)
      const [tags, count] = await data.getManyAndCount()

      return {
        data: new PaginationResponse<any>(tags, count),
      }
    } catch (error) {
      checkMysqlError(error)
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.tagRepository.findOne({
        where: { id }
      })

      return {
        data,
      };
    } catch (error) {
      checkMysqlError(error)
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      await this.tagRepository.update(id, updateTagDto)
      const tag = this.tagRepository.findOne({
        where: { id }
      })

      return {
        data: tag,
        message: SUCCESS_CODES.UPDATE_SUCCESSFULLY
      }
    } catch (error) {
      checkMysqlError(error)
    }
  }

  async remove(id: number) {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id }
      })

      if (!tag) {
        throw new NotFoundException(ERROR_CODES.DATA_NOT_FOUND)
      }

      await this.tagRepository.delete(id)
      return {
        data: {},
        message: SUCCESS_CODES.DELETE_SUCCESSFULLY
      };
    } catch (e) {
      checkMysqlError(e)
    }
  }
}
