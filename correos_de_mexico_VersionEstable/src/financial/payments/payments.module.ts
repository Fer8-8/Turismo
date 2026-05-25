import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import * as express from 'express';
import { PrismaModule } from '../../prisma/prisma.module';
import { SalesModule } from '../../commercial-sales/sales/sales.module';
// infraestructura
import { PaymentRepository } from './infrastructure/repositories/payment.repository';
import { PaymentMethodRepository } from './infrastructure/repositories/payment-method.repository';
import { RefundRepository } from './infrastructure/repositories/refund.repository';
import { RefundReasonRepository } from './infrastructure/repositories/refund-reason.repository';
import { PaymentWebhookEventRepository } from './infrastructure/repositories/payment-webhook-event.repository';
import { StripePaymentProcessor } from './infrastructure/processors/stripe-payment.processor';
// contratos de dominio
import { PAYMENT_PROCESSOR } from './domain/contracts';
// aplicación
import { PaymentService } from './application/payment.service';
import { PaymentValidationService } from './application/payment-validation.service';
import { PaymentProcessingService } from './application/payment-processing.service';
import { PaymentMethodService } from './application/payment-method.service';
import { GatewayService } from './application/gateway.service';
import { OrderPaymentService } from './application/order-payment.service';
import { RefundService } from './application/refund.service';
import { RefundReasonService } from './application/refund-reason.service';
import { PaymentWebhookService } from './application/payment-webhook.service';
// presentación
import { PaymentsResolver } from './presentation/graphql/payments.resolver';
import { StripeWebhookController } from './presentation/http/stripe-webhook.controller';
// fachada
import { PaymentsFacade } from './facades/payments.facade';

@Module({
  imports: [PrismaModule, SalesModule],
  controllers: [StripeWebhookController],
  providers: [
    // infraestructura
    PaymentRepository,
    PaymentMethodRepository,
    RefundRepository,
    RefundReasonRepository,
    PaymentWebhookEventRepository,
    {
      provide: PAYMENT_PROCESSOR,
      useClass: StripePaymentProcessor,
    },
    // aplicación
    PaymentService,
    PaymentValidationService,
    PaymentProcessingService,
    PaymentMethodService,
    GatewayService,
    OrderPaymentService,
    RefundService,
    RefundReasonService,
    PaymentWebhookService,
    // presentación
    PaymentsResolver,
    // fachada
    PaymentsFacade,
  ],
  exports: [PaymentsFacade],
})
export class PaymentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.raw({ type: 'application/json' }))
      .forRoutes({
        path: 'payments/webhooks/stripe',
        method: RequestMethod.POST,
      });
  }
}
