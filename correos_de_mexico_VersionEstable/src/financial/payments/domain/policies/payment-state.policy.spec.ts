import {
  isValidPaymentTransition,
  isCapturableState,
  isTerminalState,
  canRetryPayment,
} from './payment-state.policy';
import { PaymentState } from '../enums';

describe('isValidPaymentTransition', () => {
  it.each<[PaymentState, PaymentState, boolean]>([
    // CHECKOUT
    [PaymentState.CHECKOUT, PaymentState.PENDING, true],
    [PaymentState.CHECKOUT, PaymentState.FAILED, true],
    [PaymentState.CHECKOUT, PaymentState.AUTHORIZED, false],
    [PaymentState.CHECKOUT, PaymentState.CAPTURED, false],
    [PaymentState.CHECKOUT, PaymentState.VOID, false],
    // PENDING
    [PaymentState.PENDING, PaymentState.PROCESSING, true],
    [PaymentState.PENDING, PaymentState.FAILED, true],
    [PaymentState.PENDING, PaymentState.VOID, true],
    [PaymentState.PENDING, PaymentState.AUTHORIZED, false],
    [PaymentState.PENDING, PaymentState.CAPTURED, false],
    // PROCESSING
    [PaymentState.PROCESSING, PaymentState.AUTHORIZED, true],
    [PaymentState.PROCESSING, PaymentState.CAPTURED, true],
    [PaymentState.PROCESSING, PaymentState.FAILED, true],
    [PaymentState.PROCESSING, PaymentState.VOID, true],
    [PaymentState.PROCESSING, PaymentState.PENDING, false],
    // AUTHORIZED
    [PaymentState.AUTHORIZED, PaymentState.CAPTURED, true],
    [PaymentState.AUTHORIZED, PaymentState.VOID, true],
    [PaymentState.AUTHORIZED, PaymentState.FAILED, true],
    [PaymentState.AUTHORIZED, PaymentState.PENDING, false],
    [PaymentState.AUTHORIZED, PaymentState.PROCESSING, false],
    // CAPTURED (terminal)
    [PaymentState.CAPTURED, PaymentState.FAILED, false],
    [PaymentState.CAPTURED, PaymentState.VOID, false],
    [PaymentState.CAPTURED, PaymentState.PENDING, false],
    // FAILED
    [PaymentState.FAILED, PaymentState.PENDING, true],
    [PaymentState.FAILED, PaymentState.CAPTURED, false],
    [PaymentState.FAILED, PaymentState.AUTHORIZED, false],
    // VOID (terminal)
    [PaymentState.VOID, PaymentState.PENDING, false],
    [PaymentState.VOID, PaymentState.AUTHORIZED, false],
    [PaymentState.VOID, PaymentState.CAPTURED, false],
  ])('%s → %s returns %s', (from, to, expected) => {
    expect(isValidPaymentTransition(from, to)).toBe(expected);
  });
});

describe('isCapturableState', () => {
  it('returns true for AUTHORIZED', () => {
    expect(isCapturableState(PaymentState.AUTHORIZED)).toBe(true);
  });

  it.each<string | null>([
    PaymentState.PENDING,
    PaymentState.PROCESSING,
    PaymentState.CAPTURED,
    PaymentState.FAILED,
    PaymentState.VOID,
    PaymentState.CHECKOUT,
    null,
  ])('returns false for %s', (state) => {
    expect(isCapturableState(state)).toBe(false);
  });
});

describe('isTerminalState', () => {
  it('returns true for CAPTURED', () => {
    expect(isTerminalState(PaymentState.CAPTURED)).toBe(true);
  });

  it('returns true for VOID', () => {
    expect(isTerminalState(PaymentState.VOID)).toBe(true);
  });

  it.each<string | null>([
    PaymentState.CHECKOUT,
    PaymentState.PENDING,
    PaymentState.PROCESSING,
    PaymentState.AUTHORIZED,
    PaymentState.FAILED,
    null,
  ])('returns false for %s', (state) => {
    expect(isTerminalState(state)).toBe(false);
  });
});

describe('canRetryPayment', () => {
  it('returns true for FAILED', () => {
    expect(canRetryPayment(PaymentState.FAILED)).toBe(true);
  });

  it.each<string | null>([
    PaymentState.CHECKOUT,
    PaymentState.PENDING,
    PaymentState.PROCESSING,
    PaymentState.AUTHORIZED,
    PaymentState.CAPTURED,
    PaymentState.VOID,
    null,
  ])('returns false for %s', (state) => {
    expect(canRetryPayment(state)).toBe(false);
  });
});
