export enum PaymentState {
  CHECKOUT = 'checkout',
  PENDING = 'pending',
  PROCESSING = 'processing',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  VOID = 'void',
}

export const PAYMENT_STATE_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
  [PaymentState.CHECKOUT]: [PaymentState.PENDING, PaymentState.FAILED],
  [PaymentState.PENDING]: [PaymentState.PROCESSING, PaymentState.FAILED, PaymentState.VOID],
  [PaymentState.PROCESSING]: [PaymentState.AUTHORIZED, PaymentState.CAPTURED, PaymentState.FAILED, PaymentState.VOID],
  [PaymentState.AUTHORIZED]: [PaymentState.CAPTURED, PaymentState.VOID, PaymentState.FAILED],
  [PaymentState.CAPTURED]: [],
  [PaymentState.FAILED]: [PaymentState.PENDING],
  [PaymentState.VOID]: [],
};
