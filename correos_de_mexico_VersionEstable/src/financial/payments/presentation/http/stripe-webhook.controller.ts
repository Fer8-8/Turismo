import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentWebhookService } from '../../application/payment-webhook.service';
import { PaymentProcessingException } from '../../domain/exceptions';

@Controller('payments/webhooks')
export class StripeWebhookController {
  constructor(
    private readonly paymentWebhookService: PaymentWebhookService,
  ) {}

  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(
    @Req() request: Request & { body: Buffer },
    @Headers('stripe-signature') signature?: string,
  ) {
    if (!signature) {
      throw new PaymentProcessingException(
        'Missing stripe-signature header',
      );
    }

    const rawBody = request.body;
    if (!Buffer.isBuffer(rawBody)) {
      throw new PaymentProcessingException(
        'Stripe webhook requires raw request body',
      );
    }

    return this.paymentWebhookService.handleStripeWebhook(rawBody, signature);
  }
}
