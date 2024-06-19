import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly tagRepository: Repository<Status>,
  ) {}
  create(createStatusDto: CreateStatusDto) {
    return 'This action adds a new status';
  }

  async findAll() {
    try {
      return {
        data: await this.tagRepository.find(),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
