import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { Repository } from 'typeorm';
import { EmployeeConfig } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class employeeServices {
  constructor(
    @InjectRepository(EmployeeConfig)
    private readonly employeeRepository: Repository<EmployeeConfig>,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new industry';
  }

  async findAll() {
    try {
      const data = await this.employeeRepository.find();
      const employeeList = data.map((item) => {
        if (+item.end_number > 1000) {
          return {
            id: item.id,
            name: ` > ${item.start_number}`,
          };
        }
        return {
          id: item.id,
          name: `${item.start_number + '-' + item.end_number}`,
        };
      });
      return {
        data: employeeList,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} industry`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} industry`;
  }

  remove(id: number) {
    return `This action removes a #${id} industry`;
  }
}
