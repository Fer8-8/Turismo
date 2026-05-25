import {
  parseActionPreferences,
  calculateOrderDiscount,
  calculateLineDiscount,
  isOrderLevelAction,
  isLineLevelAction,
} from './promotion-discount.calculator';
import { PromotionActionType } from '../enums/promotion-action-type.enum';
import { InvalidActionPreferencesException } from '../exceptions/promotion.exceptions';

describe('parseActionPreferences', () => {
  it('parses fixed amount for ORDER_FIXED_DISCOUNT', () => {
    const result = parseActionPreferences(
      PromotionActionType.ORDER_FIXED_DISCOUNT,
      JSON.stringify({ amount: 50 }),
    );
    expect(result).toEqual({ amount: 50 });
  });

  it('parses percent for ORDER_PERCENT_DISCOUNT', () => {
    const result = parseActionPreferences(
      PromotionActionType.ORDER_PERCENT_DISCOUNT,
      JSON.stringify({ percent: 15 }),
    );
    expect(result).toEqual({ percent: 15 });
  });

  it('parses fixed amount for LINE_ITEM_FIXED_DISCOUNT', () => {
    const result = parseActionPreferences(
      PromotionActionType.LINE_ITEM_FIXED_DISCOUNT,
      JSON.stringify({ amount: 10 }),
    );
    expect(result).toEqual({ amount: 10 });
  });

  it('parses percent for LINE_ITEM_PERCENT_DISCOUNT', () => {
    const result = parseActionPreferences(
      PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT,
      JSON.stringify({ percent: 20 }),
    );
    expect(result).toEqual({ percent: 20 });
  });

  it('throws when raw is null', () => {
    expect(() =>
      parseActionPreferences(PromotionActionType.ORDER_FIXED_DISCOUNT, null),
    ).toThrow(InvalidActionPreferencesException);
  });

  it('throws when raw is not valid JSON', () => {
    expect(() =>
      parseActionPreferences(PromotionActionType.ORDER_FIXED_DISCOUNT, '{bad json'),
    ).toThrow(InvalidActionPreferencesException);
  });

  it('throws when amount is negative for fixed discount', () => {
    expect(() =>
      parseActionPreferences(
        PromotionActionType.ORDER_FIXED_DISCOUNT,
        JSON.stringify({ amount: -1 }),
      ),
    ).toThrow(InvalidActionPreferencesException);
  });

  it('throws when percent > 100', () => {
    expect(() =>
      parseActionPreferences(
        PromotionActionType.ORDER_PERCENT_DISCOUNT,
        JSON.stringify({ percent: 101 }),
      ),
    ).toThrow(InvalidActionPreferencesException);
  });

  it('throws when percent is negative', () => {
    expect(() =>
      parseActionPreferences(
        PromotionActionType.ORDER_PERCENT_DISCOUNT,
        JSON.stringify({ percent: -5 }),
      ),
    ).toThrow(InvalidActionPreferencesException);
  });

  it('throws for unrecognised action type', () => {
    expect(() =>
      parseActionPreferences('unknown_type', JSON.stringify({ amount: 10 })),
    ).toThrow(InvalidActionPreferencesException);
  });
});

describe('calculateOrderDiscount', () => {
  it('returns the fixed amount for ORDER_FIXED_DISCOUNT', () => {
    expect(
      calculateOrderDiscount(
        PromotionActionType.ORDER_FIXED_DISCOUNT,
        { amount: 30 },
        200,
      ),
    ).toBe(30);
  });

  it('caps ORDER_FIXED_DISCOUNT at itemTotal when amount exceeds total', () => {
    expect(
      calculateOrderDiscount(
        PromotionActionType.ORDER_FIXED_DISCOUNT,
        { amount: 500 },
        200,
      ),
    ).toBe(200);
  });

  it('calculates percent discount for ORDER_PERCENT_DISCOUNT', () => {
    expect(
      calculateOrderDiscount(
        PromotionActionType.ORDER_PERCENT_DISCOUNT,
        { percent: 10 },
        300,
      ),
    ).toBe(30);
  });

  it('returns 0 for 0% order discount', () => {
    expect(
      calculateOrderDiscount(
        PromotionActionType.ORDER_PERCENT_DISCOUNT,
        { percent: 0 },
        300,
      ),
    ).toBe(0);
  });

  it('returns full itemTotal for 100% order percent discount', () => {
    expect(
      calculateOrderDiscount(
        PromotionActionType.ORDER_PERCENT_DISCOUNT,
        { percent: 100 },
        300,
      ),
    ).toBe(300);
  });

  it('returns 0 for unrecognised action type', () => {
    expect(
      calculateOrderDiscount('unknown', { amount: 50 } as any, 200),
    ).toBe(0);
  });
});

describe('calculateLineDiscount', () => {
  it('returns the fixed amount for LINE_ITEM_FIXED_DISCOUNT', () => {
    expect(
      calculateLineDiscount(
        PromotionActionType.LINE_ITEM_FIXED_DISCOUNT,
        { amount: 10 },
        100,
      ),
    ).toBe(10);
  });

  it('caps LINE_ITEM_FIXED_DISCOUNT at lineSubtotal', () => {
    expect(
      calculateLineDiscount(
        PromotionActionType.LINE_ITEM_FIXED_DISCOUNT,
        { amount: 999 },
        50,
      ),
    ).toBe(50);
  });

  it('calculates percent discount for LINE_ITEM_PERCENT_DISCOUNT', () => {
    expect(
      calculateLineDiscount(
        PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT,
        { percent: 20 },
        200,
      ),
    ).toBe(40);
  });

  it('returns full lineSubtotal for 100% line percent discount', () => {
    expect(
      calculateLineDiscount(
        PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT,
        { percent: 100 },
        150,
      ),
    ).toBe(150);
  });

  it('returns 0 for unrecognised action type', () => {
    expect(
      calculateLineDiscount('unknown', { amount: 10 } as any, 100),
    ).toBe(0);
  });
});

describe('isOrderLevelAction / isLineLevelAction', () => {
  it('ORDER_FIXED_DISCOUNT is order-level', () => {
    expect(isOrderLevelAction(PromotionActionType.ORDER_FIXED_DISCOUNT)).toBe(true);
    expect(isLineLevelAction(PromotionActionType.ORDER_FIXED_DISCOUNT)).toBe(false);
  });

  it('ORDER_PERCENT_DISCOUNT is order-level', () => {
    expect(isOrderLevelAction(PromotionActionType.ORDER_PERCENT_DISCOUNT)).toBe(true);
    expect(isLineLevelAction(PromotionActionType.ORDER_PERCENT_DISCOUNT)).toBe(false);
  });

  it('LINE_ITEM_FIXED_DISCOUNT is line-level', () => {
    expect(isLineLevelAction(PromotionActionType.LINE_ITEM_FIXED_DISCOUNT)).toBe(true);
    expect(isOrderLevelAction(PromotionActionType.LINE_ITEM_FIXED_DISCOUNT)).toBe(false);
  });

  it('LINE_ITEM_PERCENT_DISCOUNT is line-level', () => {
    expect(isLineLevelAction(PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT)).toBe(true);
    expect(isOrderLevelAction(PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT)).toBe(false);
  });

  it('unknown type is neither order- nor line-level', () => {
    expect(isOrderLevelAction('unknown')).toBe(false);
    expect(isLineLevelAction('unknown')).toBe(false);
  });
});
