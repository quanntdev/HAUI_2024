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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { RequestWithUser } from 'src/common/interfaces';
import { CustomerLevelService } from './customer-level.service';
import { CreateCustomerLevelDto } from './dto/create-customer-level.dto';
import { UpdateCustomerLevelDto } from './dto/update-customer-level.dto';

@ApiTags('CustomerLevel')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/customer-level')
export class CustomerLevelController {
  constructor(private readonly customerLevelService: CustomerLevelService) {}

  @Post()
  create(
    @Body() body: CreateCustomerLevelDto,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.customerLevelService.create(body, headers, req);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.customerLevelService.remove(+id, headers, req);
  }

  @Get()
  findAll(
    @Headers() headers,
    @Req() req: RequestWithUser,
    @Query() pagination: any,
  ) {
    return this.customerLevelService.findAll(headers, req, pagination);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.customerLevelService.findOne(+id, headers, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCustomerLevelDto,
    @Headers() headers,
    @Req() req: RequestWithUser,
  ) {
    return this.customerLevelService.update(+id, body, headers, req);
  }
}
