import { Module } from '@nestjs/common';
import { employeeServices } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeConfig } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeConfig])],
  controllers: [EmployeeController],
  providers: [employeeServices],
})
export class EmployeeModule {}
