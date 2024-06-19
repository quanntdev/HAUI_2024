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
import { BillingTypesService } from './billing-types.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from '../../common/guards/user';

@ApiTags('BillingTypes')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/billing-types')
export class BillingTypesController {
  constructor(private readonly billingTypesService: BillingTypesService) {}

  @Get()
  findAll() {
    return this.billingTypesService.findAll();
  }
}
