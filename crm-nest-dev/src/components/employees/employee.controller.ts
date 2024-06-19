import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { employeeServices } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from '../../common/guards/user';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/employees')
export class EmployeeController {
  constructor(private readonly employeeServices: employeeServices) {}

  @Post()
  create(@Body() CreateEmployeeDto: CreateEmployeeDto) {
    return this.employeeServices.create(CreateEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeServices.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeServices.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeServices.remove(+id);
  }
}
