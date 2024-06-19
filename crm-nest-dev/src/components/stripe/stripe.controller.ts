import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';

@ApiTags('stripe')
@Controller('api/stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @Post('setup-intent')
    async createSetupIntent(@Body('customerId') customerId: string) {
    try {
      const setupIntent = await this.stripeService.createSetupIntent("invoce1", "123", 100);
      return setupIntent;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-product')
    async createProduct() {
    try {
      const setupIntent = await this.stripeService.createProduct("invoce1", "123", 100);
      return setupIntent;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-payment')
    async createPayment() {
    try {
      const setupIntent = await this.stripeService.createPaymentIntent();
      return setupIntent;
    } catch (error) {
      return { error: error.message };
    }
  }
}
