import { PaymentState, PAYMENT_STATE_TRANSITIONS } from '../enums';

export function isValidPaymentTransition(
  from: PaymentState,
  to: PaymentState,
): boolean {
  return PAYMENT_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isCapturableState(state: string | null): boolean {
  return state === PaymentState.AUTHORIZED;
}

export function isTerminalState(state: string | null): boolean {
  return state === PaymentState.CAPTURED || state === PaymentState.VOID;
}

export function canRetryPayment(state: string | null): boolean {
  return state === PaymentState.FAILED;
}
