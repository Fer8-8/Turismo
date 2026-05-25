// webhook readiness — contratos para el manejo futuro de webhooks de stripe.
// en esta primera ola no se implementa el controller http completo,
// pero se deja la estructura preparada para que en la segunda ola
// sea fácil agregar:
//   - post /payments/webhooks/stripe
//   - verificación de firma (stripe-signature header)
//   - mapeo de eventos stripe a eventos internos
//
// eventos stripe esperados a soportar:
//   - payment_intent.succeeded
//   - payment_intent.payment_failed
//   - payment_intent.canceled
//   - charge.captured
//   - charge.refunded (ola 2)

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export const STRIPE_EVENTS_MAP = {
  'payment_intent.amount_capturable_updated': 'payment.authorized',
  'payment_intent.succeeded': 'payment.captured',
  'payment_intent.payment_failed': 'payment.failed',
  'payment_intent.canceled': 'payment.voided',
} as const;

export type StripeEventType = keyof typeof STRIPE_EVENTS_MAP;
