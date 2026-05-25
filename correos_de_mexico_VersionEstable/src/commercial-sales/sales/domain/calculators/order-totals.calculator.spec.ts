import {
  calculateLineSubtotal,
  consolidateOrderTotals,
} from './order-totals.calculator';

describe('calculateLineSubtotal', () => {
  it('multiplies price by quantity', () => {
    expect(calculateLineSubtotal(100, 3)).toBe(300);
  });

  it('rounds to 2 decimal places', () => {
    // 33.33 * 3 = 99.99000000000001 in float → toFixed(2) → 99.99
    expect(calculateLineSubtotal(33.33, 3)).toBe(99.99);
  });

  it('returns 0 for zero quantity', () => {
    expect(calculateLineSubtotal(99, 0)).toBe(0);
  });

  it('handles fractional prices correctly (no floating-point drift)', () => {
    // 99.99 × 3 should not produce 299.97000000000003
    expect(calculateLineSubtotal(99.99, 3)).toBe(299.97);
  });
});

describe('consolidateOrderTotals', () => {
  const baseLine = (overrides = {}) => ({
    price: 100,
    quantity: 2,
    adjustment_total: 0,
    promo_total: 0,
    additional_tax_total: 0,
    included_tax_total: 0,
    ...overrides,
  });

  it('sums item_total across all lines', () => {
    const result = consolidateOrderTotals([baseLine(), baseLine({ price: 50 })]);
    expect(result.item_total).toBe(300); // 200 + 100
  });

  it('sums item_count correctly', () => {
    const result = consolidateOrderTotals([baseLine({ quantity: 3 }), baseLine({ quantity: 1 })]);
    expect(result.item_count).toBe(4);
  });

  it('sums adjustment_total from all lines', () => {
    const result = consolidateOrderTotals([
      baseLine({ adjustment_total: -10 }),
      baseLine({ adjustment_total: -5 }),
    ]);
    expect(result.adjustment_total).toBe(-15);
  });

  it('sums promo_total from all lines', () => {
    const result = consolidateOrderTotals([
      baseLine({ promo_total: -20 }),
      baseLine({ promo_total: -10 }),
    ]);
    expect(result.promo_total).toBe(-30);
  });

  it('sums additional_tax_total from all lines', () => {
    const result = consolidateOrderTotals([
      baseLine({ additional_tax_total: 16 }),
      baseLine({ additional_tax_total: 8 }),
    ]);
    expect(result.additional_tax_total).toBe(24);
  });

  it('sums included_tax_total from all lines', () => {
    const result = consolidateOrderTotals([
      baseLine({ included_tax_total: 10 }),
      baseLine({ included_tax_total: 5 }),
    ]);
    expect(result.included_tax_total).toBe(15);
  });

  it('calculates total = item_total + adjustment + promo + shipment + additional_tax', () => {
    const result = consolidateOrderTotals(
      [baseLine({ promo_total: -20, additional_tax_total: 32 })],
      50, // shipmentTotal
    );
    // item_total=200, promo=-20, additional_tax=32, shipment=50
    expect(result.total).toBe(262);
  });

  it('does NOT include included_tax in total (it is already in price)', () => {
    const result = consolidateOrderTotals([
      baseLine({ included_tax_total: 30, additional_tax_total: 0 }),
    ]);
    // included_tax is informational; total = item_total + 0 + 0 + 0 + 0 = 200
    expect(result.total).toBe(200);
    expect(result.included_tax_total).toBe(30);
  });

  it('uses 0 defaults for shipment and payment totals', () => {
    const result = consolidateOrderTotals([baseLine()]);
    expect(result.shipment_total).toBe(0);
    expect(result.payment_total).toBe(0);
  });

  it('returns all zeros for empty line items', () => {
    const result = consolidateOrderTotals([]);
    expect(result.item_total).toBe(0);
    expect(result.total).toBe(0);
    expect(result.item_count).toBe(0);
  });

  it('handles negative promo total reducing final total', () => {
    // 2 × 150 = 300, promo -50, total should be 250
    const result = consolidateOrderTotals([baseLine({ price: 150, promo_total: -50 })]);
    expect(result.item_total).toBe(300);
    expect(result.promo_total).toBe(-50);
    expect(result.total).toBe(250);
  });
});
