import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_PROCESSOR } from '../domain/contracts';
import type { ParsedWebhookEvent, PaymentProcessor } from '../domain/contracts';
import { GatewayCode, PaymentState } from '../domain/enums';
import {
  InvalidPaymentStateTransitionException,
  PaymentNotFoundException,
  PaymentProcessingException,
} from '../domain/exceptions';
import {
  isTerminalState,
  isValidPaymentTransition,
} from '../domain/policies';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { PaymentWebhookEventRepository } from '../infrastructure/repositories/payment-webhook-event.repository';
import {
  EventBusService,
  PaymentAuthorizedEvent,
  PaymentCapturedEvent,
} from '../../../core/shared';
import { PaymentFailedEvent } from '../domain/events';

export interface WebhookHandleResult {
  received: boolean;
  duplicate: boolean;
  status: 'processed' | 'ignored';
}

@Injectable()
export class PaymentWebhookService {
  constructor(
    @Inject(PAYMENT_PROCESSOR)
    private readonly processor: PaymentProcessor,
    private readonly paymentRepo: PaymentRepository,
    private readonly webhookRepo: PaymentWebhookEventRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async handleStripeWebhook(
    rawBody: Buffer,
    signature: string,
  ): Promise<WebhookHandleResult> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new PaymentProcessingException(
        'STRIPE_WEBHOOK_SECRET is not configured',
      );
    }

    const parsed = this.processor.parseWebhookEvent({
      rawBody,
      signature,
      webhookSecret,
    });

    const delivery = await this.webhookRepo.createOrGet({
      gateway_code: this.processor.gatewayCode,
      provider_event_id: parsed.eventId,
      event_type: parsed.eventType,
      payment_intent_id: parsed.paymentIntentId,
      payload: parsed.gatewayMetadata ?? {},
    });

    if (!delivery) {
      throw new PaymentProcessingException(
        'Unable to persist webhook delivery for deduplication',
      );
    }

    if (delivery.status === 'PROCESSED' || delivery.status === 'IGNORED') {
      return {
        received: true,
        duplicate: true,
        status: delivery.status === 'PROCESSED' ? 'processed' : 'ignored',
      };
    }

    if (parsed.eventType === 'ignored') {
      await this.webhookRepo.markIgnored(
        delivery.id,
        'Event not handled by payments wave 2',
        undefined,
        parsed.paymentIntentId,
      );
      return { received: true, duplicate: false, status: 'ignored' };
    }

    const payment = await this.resolvePayment(parsed);

    if (!payment) {
      await this.webhookRepo.markFailed(
        delivery.id,
        'Payment not found for webhook event',
        undefined,
        parsed.paymentIntentId,
      );
      throw new PaymentNotFoundException(parsed.paymentIdHint ?? parsed.paymentIntentId ?? 'unknown');
    }

    const transitionStatus = await this.applyParsedEvent(payment, parsed);

    if (transitionStatus === 'ignored') {
      await this.webhookRepo.markIgnored(
        delivery.id,
        'Event produced no state change',
        payment.id,
        parsed.paymentIntentId,
      );
      return { received: true, duplicate: false, status: 'ignored' };
    }

    await this.webhookRepo.markProcessed(
      delivery.id,
      payment.id,
      parsed.paymentIntentId,
    );

    return { received: true, duplicate: false, status: 'processed' };
  }

  private async resolvePayment(parsed: ParsedWebhookEvent) {
    if (parsed.paymentIntentId) {
      const payment = await this.paymentRepo.findByPaymentIntentId(
        parsed.paymentIntentId,
      );
      if (payment) return payment;
    }

    if (parsed.paymentIdHint) {
      return this.paymentRepo.findById(parsed.paymentIdHint);
    }

    return null;
  }

  private async applyParsedEvent(payment: any, parsed: ParsedWebhookEvent) {
    const nextState = this.getTargetState(parsed.eventType);
    const currentState = payment.state as PaymentState | null;

    if (!nextState) return 'ignored';
    if (currentState === nextState) return 'ignored';
    if (currentState && isTerminalState(currentState)) return 'ignored';

    if (
      currentState &&
      !isValidPaymentTransition(currentState, nextState)
    ) {
      throw new InvalidPaymentStateTransitionException(currentState, nextState);
    }

    const metadata = {
      ...(payment.gateway_metadata as Record<string, unknown> | null ?? {}),
      ...(parsed.gatewayMetadata ?? {}),
      last_webhook_event_id: parsed.eventId,
      last_webhook_event_type: parsed.eventType,
    };

    if (nextState === PaymentState.AUTHORIZED) {
      await this.paymentRepo.updateState(payment.id, {
        state: PaymentState.AUTHORIZED,
        response_code: parsed.responseCode ?? 'payment_intent.amount_capturable_updated',
        gateway_metadata: metadata,
      });
      await this.eventBus.emit(
        new PaymentAuthorizedEvent(payment.id, payment.order_id ?? '', Number(payment.amount)),
      );
      return 'processed';
    }

    if (nextState === PaymentState.CAPTURED) {
      await this.paymentRepo.createCaptureEvent(payment.id, Number(payment.amount));
      await this.paymentRepo.updateState(payment.id, {
        state: PaymentState.CAPTURED,
        response_code: parsed.responseCode ?? 'payment_intent.succeeded',
        captured_amount: Number(payment.amount),
        gateway_metadata: metadata,
      });
      await this.eventBus.emit(
        new PaymentCapturedEvent(payment.id, payment.order_id ?? '', Number(payment.amount)),
      );
      return 'processed';
    }

    if (nextState === PaymentState.FAILED) {
      await this.paymentRepo.updateState(payment.id, {
        state: PaymentState.FAILED,
        response_code: parsed.responseCode ?? 'payment_intent.payment_failed',
        gateway_metadata: metadata,
      });
      await this.eventBus.emit(
        new PaymentFailedEvent(
          payment.id,
          payment.order_id ?? '',
          Number(payment.amount),
          parsed.errorMessage ?? 'Payment failed in Stripe webhook',
        ),
      );
      return 'processed';
    }

    if (nextState === PaymentState.VOID) {
      await this.paymentRepo.updateState(payment.id, {
        state: PaymentState.VOID,
        response_code: parsed.responseCode ?? 'payment_intent.canceled',
        gateway_metadata: metadata,
      });
      return 'processed';
    }

    return 'ignored';
  }

  private getTargetState(eventType: ParsedWebhookEvent['eventType']) {
    switch (eventType) {
      case 'payment_authorized':
        return PaymentState.AUTHORIZED;
      case 'payment_captured':
        return PaymentState.CAPTURED;
      case 'payment_failed':
        return PaymentState.FAILED;
      case 'payment_canceled':
        return PaymentState.VOID;
      default:
        return null;
    }
  }
}
