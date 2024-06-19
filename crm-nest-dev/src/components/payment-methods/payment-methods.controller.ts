import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';

@ApiTags('Payment Methods')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  findAll() {
    return this.paymentMethodsService.findAll();
  }
}
