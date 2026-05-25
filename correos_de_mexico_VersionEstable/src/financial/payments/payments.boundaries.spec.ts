/**
 * payments.boundaries.spec.ts
 *
 * Structural tests — no DI, no network, no database.
 * Verifies the shape and invariants of the public contract without instantiation.
 */
import { PaymentsFacade } from './facades/payments.facade';
import { PAYMENT_PROCESSOR } from './domain/contracts/payment-processor.contract';
import { PaymentState, PAYMENT_STATE_TRANSITIONS } from './domain/enums';

// ─── PaymentsFacade surface ───────────────────────────────────────────────────

describe('PaymentsFacade — public surface', () => {
  it('exposes payment lifecycle methods', () => {
    expect(typeof PaymentsFacade.prototype.createPayment).toBe('function');
    expect(typeof PaymentsFacade.prototype.processPayment).toBe('function');
    expect(typeof PaymentsFacade.prototype.capturePayment).toBe('function');
    expect(typeof PaymentsFacade.prototype.getPayment).toBe('function');
    expect(typeof PaymentsFacade.prototype.getPaymentsByOrder).toBe('function');
  });

  it('exposes refund methods', () => {
    expect(typeof PaymentsFacade.prototype.createRefund).toBe('function');
    expect(typeof PaymentsFacade.prototype.getRefund).toBe('function');
    expect(typeof PaymentsFacade.prototype.getRefundsByPayment).toBe('function');
    expect(typeof PaymentsFacade.prototype.getRefundsByOrder).toBe('function');
    expect(typeof PaymentsFacade.prototype.getRefundsByReimbursement).toBe('function');
  });

  it('exposes order payment integration', () => {
    expect(typeof PaymentsFacade.prototype.getOrderPaymentSummary).toBe('function');
    expect(typeof PaymentsFacade.prototype.getTotalPaidForOrder).toBe('function');
  });

  it('exposes payment method management', () => {
    expect(typeof PaymentsFacade.prototype.createPaymentMethod).toBe('function');
    expect(typeof PaymentsFacade.prototype.getPaymentMethod).toBe('function');
    expect(typeof PaymentsFacade.prototype.listPaymentMethods).toBe('function');
    expect(typeof PaymentsFacade.prototype.updatePaymentMethod).toBe('function');
    expect(typeof PaymentsFacade.prototype.activatePaymentMethod).toBe('function');
    expect(typeof PaymentsFacade.prototype.deactivatePaymentMethod).toBe('function');
  });

  it('exposes store association methods', () => {
    expect(typeof PaymentsFacade.prototype.listMethodsForStore).toBe('function');
    expect(typeof PaymentsFacade.prototype.associateMethodToStore).toBe('function');
    expect(typeof PaymentsFacade.prototype.disassociateMethodFromStore).toBe('function');
    expect(typeof PaymentsFacade.prototype.isMethodAvailableForStore).toBe('function');
  });

  it('exposes refund reason management', () => {
    expect(typeof PaymentsFacade.prototype.createRefundReason).toBe('function');
    expect(typeof PaymentsFacade.prototype.getRefundReason).toBe('function');
    expect(typeof PaymentsFacade.prototype.listRefundReasons).toBe('function');
    expect(typeof PaymentsFacade.prototype.activateRefundReason).toBe('function');
    expect(typeof PaymentsFacade.prototype.deactivateRefundReason).toBe('function');
  });
});

describe('PaymentsFacade — forbidden cross-domain methods', () => {
  it('does not expose createOrder (sales)', () => {
    expect((PaymentsFacade.prototype as any).createOrder).toBeUndefined();
  });

  it('does not expose cancelOrder (sales)', () => {
    expect((PaymentsFacade.prototype as any).cancelOrder).toBeUndefined();
  });

  it('does not expose approveOrder (sales)', () => {
    expect((PaymentsFacade.prototype as any).approveOrder).toBeUndefined();
  });

  it('does not expose calculatePromotion (marketing)', () => {
    expect((PaymentsFacade.prototype as any).calculatePromotion).toBeUndefined();
  });

  it('does not expose evaluateOrderPromotions (marketing)', () => {
    expect((PaymentsFacade.prototype as any).evaluateOrderPromotions).toBeUndefined();
  });

  it('does not expose applyPromotion (marketing)', () => {
    expect((PaymentsFacade.prototype as any).applyPromotion).toBeUndefined();
  });

  it('does not expose reserveInventory (inventory)', () => {
    expect((PaymentsFacade.prototype as any).reserveInventory).toBeUndefined();
  });

  it('does not expose releaseInventory (inventory)', () => {
    expect((PaymentsFacade.prototype as any).releaseInventory).toBeUndefined();
  });

  it('does not expose createShipment (fulfillment)', () => {
    expect((PaymentsFacade.prototype as any).createShipment).toBeUndefined();
  });

  it('does not expose createFulfillment (fulfillment)', () => {
    expect((PaymentsFacade.prototype as any).createFulfillment).toBeUndefined();
  });

  it('does not expose createReimbursement (fulfillment)', () => {
    expect((PaymentsFacade.prototype as any).createReimbursement).toBeUndefined();
  });
});

// ─── PAYMENT_PROCESSOR token ──────────────────────────────────────────────────

describe('PAYMENT_PROCESSOR injection token', () => {
  it('is a Symbol (abstract contract, never a concrete class)', () => {
    expect(typeof PAYMENT_PROCESSOR).toBe('symbol');
  });

  it('has description "PAYMENT_PROCESSOR"', () => {
    expect(PAYMENT_PROCESSOR.description).toBe('PAYMENT_PROCESSOR');
  });

  it('is unique — Symbol() with the same name does not produce equality', () => {
    const clone = Symbol('PAYMENT_PROCESSOR');
    expect(PAYMENT_PROCESSOR).not.toBe(clone);
  });
});

// ─── State machine completeness ───────────────────────────────────────────────

describe('PAYMENT_STATE_TRANSITIONS — state machine invariants', () => {
  it('every PaymentState value has an entry in the transition map', () => {
    for (const state of Object.values(PaymentState)) {
      expect(PAYMENT_STATE_TRANSITIONS).toHaveProperty(state);
      expect(Array.isArray(PAYMENT_STATE_TRANSITIONS[state])).toBe(true);
    }
  });

  it('CAPTURED is terminal — no outgoing transitions', () => {
    expect(PAYMENT_STATE_TRANSITIONS[PaymentState.CAPTURED]).toHaveLength(0);
  });

  it('VOID is terminal — no outgoing transitions', () => {
    expect(PAYMENT_STATE_TRANSITIONS[PaymentState.VOID]).toHaveLength(0);
  });

  it('CHECKOUT is the entry state — transitions to PENDING and FAILED only', () => {
    const targets = PAYMENT_STATE_TRANSITIONS[PaymentState.CHECKOUT];
    expect(targets).toContain(PaymentState.PENDING);
    expect(targets).toContain(PaymentState.FAILED);
    // Must NOT allow skipping straight to captured or authorized
    expect(targets).not.toContain(PaymentState.CAPTURED);
    expect(targets).not.toContain(PaymentState.AUTHORIZED);
    expect(targets).not.toContain(PaymentState.VOID);
  });

  it('CHECKOUT cannot jump directly to CAPTURED (must go through PROCESSING)', () => {
    expect(PAYMENT_STATE_TRANSITIONS[PaymentState.CHECKOUT]).not.toContain(
      PaymentState.CAPTURED,
    );
  });

  it('FAILED can only retry to PENDING — not directly to success states', () => {
    const targets = PAYMENT_STATE_TRANSITIONS[PaymentState.FAILED];
    expect(targets).toContain(PaymentState.PENDING);
    expect(targets).not.toContain(PaymentState.CAPTURED);
    expect(targets).not.toContain(PaymentState.AUTHORIZED);
  });

  it('AUTHORIZED can be captured or voided — not directly failed', () => {
    const targets = PAYMENT_STATE_TRANSITIONS[PaymentState.AUTHORIZED];
    expect(targets).toContain(PaymentState.CAPTURED);
    expect(targets).toContain(PaymentState.VOID);
  });

  it('PROCESSING can resolve to AUTHORIZED, CAPTURED, FAILED, or VOID', () => {
    const targets = PAYMENT_STATE_TRANSITIONS[PaymentState.PROCESSING];
    expect(targets).toContain(PaymentState.AUTHORIZED);
    expect(targets).toContain(PaymentState.CAPTURED);
    expect(targets).toContain(PaymentState.FAILED);
  });
});
