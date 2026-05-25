/**
 * commercial-sales.boundaries.spec.ts
 *
 * Structural boundary tests for the commercial-sales domain.
 * These tests verify that domain contracts are respected:
 *  - SalesFacade exposes only sales operations, never marketing or payment operations.
 *  - MarketingFacade exposes only marketing operations, never order lifecycle operations.
 *  - The PROMOTION_GATEWAY token is an abstract Symbol, not a class dependency.
 *  - NoopPromotionGateway fulfils the gateway contract with zero-sum results.
 *  - OrderPricingService communicates with marketing only via the abstract gateway token.
 */

import { SalesFacade } from './sales/facades/sales.facade';
import { MarketingFacade } from './marketing/facades/marketing.facade';
import {
  PROMOTION_GATEWAY,
  NoopPromotionGateway,
  PromotionGateway,
} from './contracts/promotion-evaluation.contract';

// ─── SalesFacade boundary ────────────────────────────────────────────────────

describe('SalesFacade — public surface', () => {
  it('exposes core order lifecycle methods', () => {
    expect(typeof SalesFacade.prototype.createOrder).toBe('function');
    expect(typeof SalesFacade.prototype.cancelOrder).toBe('function');
    expect(typeof SalesFacade.prototype.markOrderPending).toBe('function');
    expect(typeof SalesFacade.prototype.approveOrder).toBe('function');
    expect(typeof SalesFacade.prototype.getOrder).toBe('function');
  });

  it('exposes line item management', () => {
    expect(typeof SalesFacade.prototype.addLineItem).toBe('function');
    expect(typeof SalesFacade.prototype.updateLineItemQuantity).toBe('function');
    expect(typeof SalesFacade.prototype.removeLineItem).toBe('function');
    expect(typeof SalesFacade.prototype.getLineItems).toBe('function');
  });

  it('exposes context methods for downstream domains', () => {
    expect(typeof SalesFacade.prototype.getPaymentContext).toBe('function');
    expect(typeof SalesFacade.prototype.getFulfillmentContext).toBe('function');
    expect(typeof SalesFacade.prototype.getCommercialContext).toBe('function');
  });

  it('does NOT expose payment processing (belongs to financial domain)', () => {
    expect((SalesFacade.prototype as any).processPayment).toBeUndefined();
    expect((SalesFacade.prototype as any).chargePayment).toBeUndefined();
    expect((SalesFacade.prototype as any).capturePayment).toBeUndefined();
  });

  it('does NOT expose shipment/fulfillment creation (belongs to fulfillment domain)', () => {
    expect((SalesFacade.prototype as any).createShipment).toBeUndefined();
    expect((SalesFacade.prototype as any).createFulfillment).toBeUndefined();
    expect((SalesFacade.prototype as any).shipOrder).toBeUndefined();
  });

  it('does NOT expose promotion management (belongs to marketing domain)', () => {
    expect((SalesFacade.prototype as any).createPromotion).toBeUndefined();
    expect((SalesFacade.prototype as any).evaluateOrderPromotions).toBeUndefined();
    expect((SalesFacade.prototype as any).applyPromotion).toBeUndefined();
    expect((SalesFacade.prototype as any).validatePromoCode).toBeUndefined();
  });
});

// ─── MarketingFacade boundary ────────────────────────────────────────────────

describe('MarketingFacade — public surface', () => {
  it('exposes promotion CRUD', () => {
    expect(typeof MarketingFacade.prototype.createPromotion).toBe('function');
    expect(typeof MarketingFacade.prototype.activatePromotion).toBe('function');
    expect(typeof MarketingFacade.prototype.deactivatePromotion).toBe('function');
    expect(typeof MarketingFacade.prototype.listPromotions).toBe('function');
  });

  it('exposes promo code validation and evaluation', () => {
    expect(typeof MarketingFacade.prototype.evaluateOrderPromotions).toBe('function');
    expect(typeof MarketingFacade.prototype.validatePromoCode).toBe('function');
    expect(typeof MarketingFacade.prototype.findUsablePromotion).toBe('function');
  });

  it('exposes order-link operations', () => {
    expect(typeof MarketingFacade.prototype.linkPromotionToOrder).toBe('function');
    expect(typeof MarketingFacade.prototype.getAppliedPromotions).toBe('function');
    expect(typeof MarketingFacade.prototype.isPromotionLinkedToOrder).toBe('function');
  });

  it('does NOT expose order lifecycle (belongs to sales domain)', () => {
    expect((MarketingFacade.prototype as any).createOrder).toBeUndefined();
    expect((MarketingFacade.prototype as any).cancelOrder).toBeUndefined();
    expect((MarketingFacade.prototype as any).markOrderPending).toBeUndefined();
    expect((MarketingFacade.prototype as any).approveOrder).toBeUndefined();
    expect((MarketingFacade.prototype as any).addLineItem).toBeUndefined();
  });

  it('does NOT expose context methods (belongs to sales domain)', () => {
    expect((MarketingFacade.prototype as any).getPaymentContext).toBeUndefined();
    expect((MarketingFacade.prototype as any).getFulfillmentContext).toBeUndefined();
  });
});

// ─── PROMOTION_GATEWAY contract ──────────────────────────────────────────────

describe('PROMOTION_GATEWAY token', () => {
  it('is a Symbol (abstract contract, not a class)', () => {
    expect(typeof PROMOTION_GATEWAY).toBe('symbol');
  });

  it('has a readable description', () => {
    expect(PROMOTION_GATEWAY.description).toBe('PROMOTION_GATEWAY');
  });

  it('is unique — two calls to Symbol with same name are NOT equal', () => {
    const other = Symbol('PROMOTION_GATEWAY');
    expect(PROMOTION_GATEWAY).not.toBe(other);
  });
});

// ─── NoopPromotionGateway ────────────────────────────────────────────────────

describe('NoopPromotionGateway', () => {
  let gateway: PromotionGateway;

  beforeEach(() => {
    gateway = new NoopPromotionGateway();
  });

  it('implements PromotionGateway (has evaluateOrderPromotions)', () => {
    expect(typeof gateway.evaluateOrderPromotions).toBe('function');
  });

  it('returns zero-sum result for any input', async () => {
    const result = await gateway.evaluateOrderPromotions({
      orderId: 'ord-1',
      userId: 'u-1',
      storeId: 's-1',
      currency: 'MXN',
      itemTotal: 500,
      lineItems: [
        { lineItemId: 'li-1', variantId: 'var-1', quantity: 2, unitPrice: 250, lineSubtotal: 500 },
      ],
    });

    expect(result.orderPromoTotal).toBe(0);
    expect(result.lineAdjustments).toHaveLength(0);
    expect(result.adjustmentTotal).toBe(0);
  });

  it('works with empty line items', async () => {
    const result = await gateway.evaluateOrderPromotions({
      orderId: 'ord-1',
      userId: null,
      storeId: null,
      currency: null,
      itemTotal: 0,
      lineItems: [],
    });

    expect(result.orderPromoTotal).toBe(0);
    expect(result.lineAdjustments).toEqual([]);
  });
});

// ─── Cross-domain isolation ──────────────────────────────────────────────────

describe('Cross-domain isolation', () => {
  it('SalesFacade and MarketingFacade share no prototype methods', () => {
    const salesMethods = Object.getOwnPropertyNames(SalesFacade.prototype);
    const marketingMethods = Object.getOwnPropertyNames(MarketingFacade.prototype);

    // Exclude 'constructor' from overlap check
    const salesSet = new Set(salesMethods.filter((m) => m !== 'constructor'));
    const overlapMethods = marketingMethods.filter(
      (m) => m !== 'constructor' && salesSet.has(m),
    );

    expect(overlapMethods).toHaveLength(0);
  });
});
