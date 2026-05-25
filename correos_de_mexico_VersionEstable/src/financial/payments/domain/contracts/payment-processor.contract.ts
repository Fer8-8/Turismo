export const PAYMENT_PROCESSOR = Symbol('PAYMENT_PROCESSOR');

export interface ProcessPaymentInput {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethodType: string;
  metadata?: Record<string, string>;
}

export interface ProcessPaymentResult {
  success: boolean;
  status: 'authorized' | 'captured' | 'pending' | 'failed';
  gatewayTransactionId: string | null;
  responseCode: string | null;
  gatewayMetadata?: Record<string, unknown>;
  errorMessage?: string;
}

export interface CapturePaymentInput {
  paymentId: string;
  gatewayTransactionId: string;
  amount: number;
  currency: string;
}

export interface CapturePaymentResult {
  success: boolean;
  capturedAmount: number;
  responseCode: string | null;
  gatewayMetadata?: Record<string, unknown>;
  errorMessage?: string;
}

export interface RefundPaymentInput {
  refundId: string;
  paymentId: string;
  gatewayTransactionId: string;
  amount: number;
  currency: string;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundPaymentResult {
  success: boolean;
  status: 'processed' | 'pending' | 'failed';
  gatewayRefundId: string | null;
  responseCode: string | null;
  gatewayMetadata?: Record<string, unknown>;
  errorMessage?: string;
}

export interface ParseWebhookEventInput {
  rawBody: Buffer;
  signature: string;
  webhookSecret: string;
}

export interface ParsedWebhookEvent {
  eventId: string;
  eventType: 'payment_authorized' | 'payment_captured' | 'payment_failed' | 'payment_canceled' | 'ignored';
  paymentIntentId: string | null;
  paymentIdHint?: string | null;
  responseCode?: string | null;
  errorMessage?: string;
  gatewayMetadata?: Record<string, unknown>;
}

export interface PaymentProcessor {
  readonly gatewayCode: string;

  processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult>;

  capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult>;

  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;

  parseWebhookEvent(input: ParseWebhookEventInput): ParsedWebhookEvent;
}
