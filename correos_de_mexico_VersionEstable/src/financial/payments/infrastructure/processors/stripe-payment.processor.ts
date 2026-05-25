import { Injectable, Logger } from '@nestjs/common';
import StripeClient from 'stripe';
import type {
  PaymentProcessor,
  ProcessPaymentInput,
  ProcessPaymentResult,
  CapturePaymentInput,
  CapturePaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
  ParseWebhookEventInput,
  ParsedWebhookEvent,
} from '../../domain/contracts';
import { GatewayCode } from '../../domain/enums';
import { WebhookSignatureValidationException } from '../../domain/exceptions';

type StripeInstance = ReturnType<typeof StripeClient>;

@Injectable()
export class StripePaymentProcessor implements PaymentProcessor {
  readonly gatewayCode = GatewayCode.STRIPE;
  private readonly stripe: StripeInstance;
  private readonly logger = new Logger(StripePaymentProcessor.name);

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured — Stripe calls will fail');
    }
    this.stripe = StripeClient(secretKey ?? '');
  }

  async processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
    try {
      // estrategia ola 1: crear el paymentintent y persistir sus referencias,
      // dejando la resolución de confirmación/autorización para un paso posterior.
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100),
        currency: input.currency.toLowerCase(),
        capture_method: 'manual',
        metadata: {
          payment_id: input.paymentId,
          order_id: input.orderId,
          ...(input.metadata ?? {}),
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      const status = this.mapPaymentIntentStatus(paymentIntent.status);

      return {
        success: status !== 'failed',
        status,
        gatewayTransactionId: paymentIntent.id,
        responseCode: paymentIntent.status,
        gatewayMetadata: {
          client_secret: paymentIntent.client_secret,
          payment_method: paymentIntent.payment_method,
          payment_intent_status: paymentIntent.status,
        },
      };
    } catch (error) {
      this.logger.error(`Stripe processPayment failed: ${error.message}`, error.stack);

      return {
        success: false,
        status: 'failed',
        gatewayTransactionId: null,
        responseCode: error.code ?? 'unknown_error',
        errorMessage: error.message,
      };
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult> {
    try {
      const captured = await this.stripe.paymentIntents.capture(
        input.gatewayTransactionId,
        {
          amount_to_capture: Math.round(input.amount * 100),
        },
      );

      return {
        success: captured.status === 'succeeded',
        capturedAmount: input.amount,
        responseCode: captured.status,
        gatewayMetadata: {
          amount_received: captured.amount_received,
        },
      };
    } catch (error) {
      this.logger.error(`Stripe capturePayment failed: ${error.message}`, error.stack);

      return {
        success: false,
        capturedAmount: 0,
        responseCode: error.code ?? 'unknown_error',
        errorMessage: error.message,
      };
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: input.gatewayTransactionId,
        amount: Math.round(input.amount * 100),
        ...(this.mapRefundReason(input.reason)
          ? { reason: this.mapRefundReason(input.reason) }
          : {}),
        metadata: {
          refund_id: input.refundId,
          payment_id: input.paymentId,
          ...(input.metadata ?? {}),
          ...(input.reason ? { reason_label: input.reason } : {}),
        },
      });

      return {
        success: refund.status === 'succeeded' || refund.status === 'pending',
        status: refund.status === 'succeeded' ? 'processed' : refund.status === 'pending' ? 'pending' : 'failed',
        gatewayRefundId: refund.id,
        responseCode: refund.status,
        gatewayMetadata: {
          refund_status: refund.status,
          payment_intent: input.gatewayTransactionId,
        },
      };
    } catch (error) {
      this.logger.error(`Stripe refundPayment failed: ${error.message}`, error.stack);

      return {
        success: false,
        status: 'failed',
        gatewayRefundId: null,
        responseCode: error.code ?? 'unknown_error',
        errorMessage: error.message,
      };
    }
  }

  parseWebhookEvent(input: ParseWebhookEventInput): ParsedWebhookEvent {
    try {
      const event = this.stripe.webhooks.constructEvent(
        input.rawBody,
        input.signature,
        input.webhookSecret,
      ) as Record<string, any>;

      const object = event.data?.object ?? {};
      const metadata = object.metadata ?? {};

      switch (event.type) {
        case 'payment_intent.amount_capturable_updated':
          return {
            eventId: event.id,
            eventType: 'payment_authorized',
            paymentIntentId: object.id ?? null,
            paymentIdHint: metadata.payment_id ?? null,
            responseCode: event.type,
            gatewayMetadata: {
              stripe_event_type: event.type,
              stripe_status: object.status,
              metadata,
            },
          };
        case 'payment_intent.succeeded':
          return {
            eventId: event.id,
            eventType: 'payment_captured',
            paymentIntentId: object.id ?? null,
            paymentIdHint: metadata.payment_id ?? null,
            responseCode: event.type,
            gatewayMetadata: {
              stripe_event_type: event.type,
              stripe_status: object.status,
              metadata,
            },
          };
        case 'payment_intent.payment_failed':
          return {
            eventId: event.id,
            eventType: 'payment_failed',
            paymentIntentId: object.id ?? null,
            paymentIdHint: metadata.payment_id ?? null,
            responseCode: event.type,
            errorMessage: object.last_payment_error?.message ?? 'El pago de Stripe falló',
            gatewayMetadata: {
              stripe_event_type: event.type,
              stripe_status: object.status,
              metadata,
              last_payment_error_code: object.last_payment_error?.code ?? null,
              last_payment_error_message: object.last_payment_error?.message ?? null,
            },
          };
        case 'payment_intent.canceled':
          return {
            eventId: event.id,
            eventType: 'payment_canceled',
            paymentIntentId: object.id ?? null,
            paymentIdHint: metadata.payment_id ?? null,
            responseCode: event.type,
            gatewayMetadata: {
              stripe_event_type: event.type,
              stripe_status: object.status,
              metadata,
            },
          };
        default:
          return {
            eventId: event.id,
            eventType: 'ignored',
            paymentIntentId: object.id ?? null,
            paymentIdHint: metadata.payment_id ?? null,
            responseCode: event.type,
            gatewayMetadata: {
              stripe_event_type: event.type,
              stripe_status: object.status ?? null,
              metadata,
            },
          };
      }
    } catch {
      throw new WebhookSignatureValidationException();
    }
  }

  private mapPaymentIntentStatus(
    status: string,
  ): ProcessPaymentResult['status'] {
    switch (status) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'requires_capture':
        return 'authorized';
      case 'succeeded':
        return 'captured';
      case 'processing':
        return 'pending';
      default:
        return 'failed';
    }
  }

  private mapRefundReason(reason?: string): 'duplicate' | 'fraudulent' | 'requested_by_customer' | undefined {
    if (!reason) return undefined;

    const normalized = reason.trim().toLowerCase();
    if (
      normalized === 'duplicate' ||
      normalized === 'fraudulent' ||
      normalized === 'requested_by_customer'
    ) {
      return normalized;
    }

    return undefined;
  }
}
