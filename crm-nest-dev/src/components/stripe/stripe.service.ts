import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import config from "../../config";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe("sk_test_51NGuuDExHzsfvFYJTtxGYwb3LyEQ5OdE1FNScUmUjmvbi9nhrQZNHxDrGVeu359cRZHPxqraaVA7kMIJ9YuwiMCF008By5V3nw", {
      apiVersion: '2024-04-10',
    });
  }

  async createSetupIntent(amount, currency, description) {
    try {
        const setupIntent =await this.stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            description: description,
            automatic_payment_methods: {
                enabled: true,
            },
        });
      return setupIntent;
    } catch (error) {
      console.log(error)
      throw new Error(`Failed to create SetupIntent: ${error.message}`);
    }
  }
  async createProduct(name: string, description: string, price: number) {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
        type: 'service',
      });

      const priceObject = await this.stripe.prices.create({
        unit_amount: price * 100,
        currency: 'usd',
        product: product.id,
      });

      return { product, price: priceObject };
    } catch (error) {
      throw new Error(`Failed to create product on Stripe: ${error.message}`);
    }
  }

  async createPaymentIntent (){
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm("seti_1PLfmNExHzsfvFYJViKDLj32");
      return paymentIntent;
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      throw error;
    }
  };
}