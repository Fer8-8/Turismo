import { Inject, Injectable, Logger } from '@nestjs/common';
import { PAYMENT_PROCESSOR } from '../domain/contracts';
import type { PaymentProcessor } from '../domain/contracts';
import { PaymentState } from '../domain/enums';
import {
  PaymentProcessingException,
  PaymentNotAuthorizedException,
  PaymentAlreadyCapturedException,
} from '../domain/exceptions';
import { isCapturableState } from '../domain/policies';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import {
  EventBusService,
  PaymentAuthorizedEvent,
  PaymentCapturedEvent,
} from '../../../core/shared';
import { PaymentFailedEvent } from '../domain/events';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';

@Injectable()
export class PaymentProcessingService {
  private readonly logger = new Logger(PaymentProcessingService.name);

  constructor(
    @Inject(PAYMENT_PROCESSOR)
    private readonly processor: PaymentProcessor,
    private readonly paymentRepo: PaymentRepository,
    private readonly eventBus: EventBusService,
    private readonly salesFacade: SalesFacade,
  ) {}

  async processPayment(
    paymentId: string,
    orderId: string,
    amount: number,
    currency: string,
    paymentMethodType: string,
  ) {
    // marcar como procesando
    await this.paymentRepo.updateState(paymentId, {
      state: PaymentState.PROCESSING,
    });

    const result = await this.processor.processPayment({
      paymentId,
      orderId,
      amount,
      currency,
      paymentMethodType,
    });

    if (result.success) {
      const newState =
        result.status === 'authorized'
          ? PaymentState.AUTHORIZED
          : result.status === 'captured'
            ? PaymentState.CAPTURED
            : PaymentState.PENDING;

      const updated = await this.paymentRepo.updateState(paymentId, {
        state: newState,
        response_code: result.responseCode,
        payment_intent_id: result.gatewayTransactionId,
        gateway_metadata: result.gatewayMetadata as Record<string, unknown>,
        ...(newState === PaymentState.CAPTURED ? { captured_amount: amount } : {}),
      });

      // emitir eventos
      if (newState === PaymentState.AUTHORIZED) {
        await this.eventBus.emit(
          new PaymentAuthorizedEvent(paymentId, orderId, amount),
        );
      } else if (newState === PaymentState.CAPTURED) {
        await this.paymentRepo.createCaptureEvent(paymentId, amount);
        await this.eventBus.emit(
          new PaymentCapturedEvent(paymentId, orderId, amount),
        );
      }

      return updated;
    }

    // falló
    await this.paymentRepo.updateState(paymentId, {
      state: PaymentState.FAILED,
      response_code: result.responseCode,
      payment_intent_id: result.gatewayTransactionId,
      gateway_metadata: result.gatewayMetadata as Record<string, unknown>,
    });

    await this.eventBus.emit(
      new PaymentFailedEvent(
        paymentId,
        orderId,
        amount,
        result.errorMessage ?? 'Payment processing failed',
      ),
    );

    throw new PaymentProcessingException(
      result.errorMessage ?? 'Payment processing failed',
    );
  }

  async capturePayment(paymentId: string) {
    const payment = await this.paymentRepo.findByIdOrThrow(paymentId);

    if (!isCapturableState(payment.state)) {
      if (payment.state === PaymentState.CAPTURED) {
        throw new PaymentAlreadyCapturedException(paymentId);
      }
      throw new PaymentNotAuthorizedException(paymentId);
    }

    if (!payment.payment_intent_id) {
      throw new PaymentProcessingException(
        'No gateway transaction id found for capture',
      );
    }

    if (!payment.order_id) {
      throw new PaymentProcessingException(
        'Payment is not linked to an order with currency context',
      );
    }

    const amount = Number(payment.amount);
    const orderCtx = await this.salesFacade.getPaymentContext(payment.order_id);

    if (!orderCtx.currency) {
      throw new PaymentProcessingException(
        'Order currency is required to capture the payment',
      );
    }

    const result = await this.processor.capturePayment({
      paymentId,
      gatewayTransactionId: payment.payment_intent_id,
      amount,
      currency: orderCtx.currency,
    });

    if (!result.success) {
      throw new PaymentProcessingException(
        result.errorMessage ?? 'Capture failed',
      );
    }

    await this.paymentRepo.createCaptureEvent(paymentId, result.capturedAmount);

    const updated = await this.paymentRepo.updateState(paymentId, {
      state: PaymentState.CAPTURED,
      response_code: result.responseCode,
      captured_amount: result.capturedAmount,
      gateway_metadata: result.gatewayMetadata as Record<string, unknown>,
    });

    await this.eventBus.emit(
      new PaymentCapturedEvent(
        paymentId,
        payment.order_id ?? '',
        result.capturedAmount,
      ),
    );

    return updated;
  }
}
