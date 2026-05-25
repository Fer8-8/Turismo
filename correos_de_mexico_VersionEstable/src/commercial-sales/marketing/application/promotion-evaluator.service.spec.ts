import { Test, TestingModule } from '@nestjs/testing';
import {
  PromotionEvaluatorService,
  OrderCandidateInput,
} from './promotion-evaluator.service';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { PromotionRuleRepository } from '../infrastructure/repositories/promotion-rule.repository';
import { PromotionActionRepository } from '../infrastructure/repositories/promotion-action.repository';
import { PromotionCodeService } from './promotion-code.service';
import { PromotionRuleType } from '../domain/enums/promotion-rule-type.enum';
import { PromotionActionType } from '../domain/enums/promotion-action-type.enum';

const mockPromotion = (overrides: Record<string, unknown> = {}) => ({
  id: 'promo-1',
  name: 'Test Promo',
  code: null,
  active: true,
  match_policy: 'all',
  starts_at: null,
  expires_at: null,
  usage_limit: null,
  usage_count: 0,
  promotionsStores: [],
  promotionRules: [],
  promotionActions: [],
  ...overrides,
});

const baseInput: OrderCandidateInput = {
  orderId: 'order-1',
  userId: 'user-1',
  storeId: 'store-1',
  currency: 'MXN',
  itemTotal: 200,
  lineItems: [
    {
      lineItemId: 'li-1',
      variantId: 'variant-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 100,
      lineSubtotal: 200,
    },
  ],
};

const multiLineInput: OrderCandidateInput = {
  ...baseInput,
  itemTotal: 300,
  lineItems: [
    {
      lineItemId: 'li-1',
      variantId: 'variant-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 100,
      lineSubtotal: 200,
    },
    {
      lineItemId: 'li-2',
      variantId: 'variant-2',
      productId: 'product-2',
      quantity: 1,
      unitPrice: 100,
      lineSubtotal: 100,
    },
  ],
};

describe('PromotionEvaluatorService', () => {
  let service: PromotionEvaluatorService;
  let promotionRepo: jest.Mocked<PromotionRepository>;
  let ruleRepo: jest.Mocked<PromotionRuleRepository>;
  let actionRepo: jest.Mocked<PromotionActionRepository>;
  let codeService: jest.Mocked<PromotionCodeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionEvaluatorService,
        {
          provide: PromotionRepository,
          useValue: {
            findActiveByStore: jest.fn(),
            findActiveGlobal: jest.fn(),
          },
        },
        {
          provide: PromotionRuleRepository,
          useValue: { findByPromotion: jest.fn() },
        },
        {
          provide: PromotionActionRepository,
          useValue: { findByPromotion: jest.fn() },
        },
        {
          provide: PromotionCodeService,
          useValue: { isCodeMatch: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(PromotionEvaluatorService);
    promotionRepo = module.get(PromotionRepository);
    ruleRepo = module.get(PromotionRuleRepository);
    actionRepo = module.get(PromotionActionRepository);
    codeService = module.get(PromotionCodeService);
  });

  it('returns zero totals when no promotions exist', async () => {
    promotionRepo.findActiveByStore.mockResolvedValue([]);

    const result = await service.evaluate(baseInput);

    expect(result.orderPromoTotal).toBe(0);
    expect(result.lineAdjustments).toHaveLength(0);
    expect(result.adjustmentTotal).toBe(0);
    expect(result.appliedPromotionIds).toHaveLength(0);
  });

  it('skips inactive promotions', async () => {
    const inactive = mockPromotion({ active: false }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([inactive]);

    const result = await service.evaluate(baseInput);

    expect(result.orderPromoTotal).toBe(0);
  });

  it('applies an order fixed discount with no rules', async () => {
    const promo = mockPromotion() as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([]);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-1',
        type: PromotionActionType.ORDER_FIXED_DISCOUNT,
        preferences: JSON.stringify({ amount: 20 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate(baseInput);

    expect(result.orderPromoTotal).toBe(-20);
    expect(result.adjustmentTotal).toBe(-20);
    expect(result.appliedPromotionIds).toContain('promo-1');
  });

  it('applies a percent discount on order total', async () => {
    const promo = mockPromotion() as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([]);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-2',
        type: PromotionActionType.ORDER_PERCENT_DISCOUNT,
        preferences: JSON.stringify({ percent: 10 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate({ ...baseInput, itemTotal: 300 });

    expect(result.orderPromoTotal).toBe(-30);
  });

  it('applies a line-level percent discount', async () => {
    const promo = mockPromotion() as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([]);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-3',
        type: PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT,
        preferences: JSON.stringify({ percent: 10 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate(baseInput);

    expect(result.lineAdjustments).toHaveLength(1);
    expect(result.lineAdjustments[0].promoTotal).toBe(-20);
    expect(result.adjustmentTotal).toBe(-20);
  });

  it('filters promotion out when product rule does not match', async () => {
    const promo = mockPromotion({ match_policy: 'all' }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([
      {
        id: 'rule-1',
        type: PromotionRuleType.PRODUCT,
        code: null,
        preferences: null,
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [{ product_id: 'product-OTHER', id: 'x', promotion_rule_id: 'rule-1', created_at: null, updated_at: null }],
        promotionRuleUsers: [],
      },
    ] as any);

    const result = await service.evaluate(baseInput);

    expect(result.orderPromoTotal).toBe(0);
    expect(result.appliedPromotionIds).toHaveLength(0);
  });

  it('applies promotion when product rule matches', async () => {
    const promo = mockPromotion({ match_policy: 'all' }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([
      {
        id: 'rule-1',
        type: PromotionRuleType.PRODUCT,
        code: null,
        preferences: null,
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [{ product_id: 'product-1', id: 'x', promotion_rule_id: 'rule-1', created_at: null, updated_at: null }],
        promotionRuleUsers: [],
      },
    ] as any);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-4',
        type: PromotionActionType.ORDER_FIXED_DISCOUNT,
        preferences: JSON.stringify({ amount: 15 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate(baseInput);

    expect(result.orderPromoTotal).toBe(-15);
    expect(result.appliedPromotionIds).toContain('promo-1');
  });

  it('applies user rule when userId matches', async () => {
    const promo = mockPromotion({ match_policy: 'all' }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([
      {
        id: 'rule-2',
        type: PromotionRuleType.USER,
        code: null,
        preferences: null,
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [],
        promotionRuleUsers: [{ user_id: 'user-1', id: 'y', promotion_rule_id: 'rule-2', created_at: null, updated_at: null }],
      },
    ] as any);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-5',
        type: PromotionActionType.ORDER_FIXED_DISCOUNT,
        preferences: JSON.stringify({ amount: 10 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate(baseInput);

    expect(result.orderPromoTotal).toBe(-10);
  });

  it('applies code rule when code matches', async () => {
    const promo = mockPromotion({ match_policy: 'all' }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([
      {
        id: 'rule-3',
        type: PromotionRuleType.CODE,
        code: 'SAVE10',
        preferences: null,
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [],
        promotionRuleUsers: [],
      },
    ] as any);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-6',
        type: PromotionActionType.ORDER_FIXED_DISCOUNT,
        preferences: JSON.stringify({ amount: 10 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);
    codeService.isCodeMatch.mockReturnValue(true);

    const result = await service.evaluate({ ...baseInput, promoCode: 'SAVE10' });

    expect(result.orderPromoTotal).toBe(-10);
  });

  it('applies a line action only to lines matched by a product rule', async () => {
    const promo = mockPromotion({ match_policy: 'all' }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([
      {
        id: 'rule-4',
        type: PromotionRuleType.PRODUCT,
        code: null,
        preferences: null,
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [{ product_id: 'product-1', id: 'x', promotion_rule_id: 'rule-4', created_at: null, updated_at: null }],
        promotionRuleUsers: [],
      },
    ] as any);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-7',
        type: PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT,
        preferences: JSON.stringify({ percent: 10 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate(multiLineInput);

    expect(result.lineAdjustments).toEqual([
      { lineItemId: 'li-1', promoTotal: -20 },
    ]);
    expect(result.adjustmentTotal).toBe(-20);
  });

  it('uses union of matched line rules when policy is any', async () => {
    const promo = mockPromotion({ match_policy: 'any' }) as any;
    promotionRepo.findActiveByStore.mockResolvedValue([promo]);
    ruleRepo.findByPromotion.mockResolvedValue([
      {
        id: 'rule-5',
        type: PromotionRuleType.PRODUCT,
        code: null,
        preferences: null,
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [{ product_id: 'product-1', id: 'x1', promotion_rule_id: 'rule-5', created_at: null, updated_at: null }],
        promotionRuleUsers: [],
      },
      {
        id: 'rule-6',
        type: PromotionRuleType.VARIANT,
        code: null,
        preferences: JSON.stringify({ variant_ids: ['variant-2'] }),
        promotion_id: 'promo-1',
        user_id: null,
        product_group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        productPromotionRules: [],
        promotionRuleUsers: [],
      },
    ] as any);
    actionRepo.findByPromotion.mockResolvedValue([
      {
        id: 'action-8',
        type: PromotionActionType.LINE_ITEM_FIXED_DISCOUNT,
        preferences: JSON.stringify({ amount: 5 }),
        position: 1,
        promotion_id: 'promo-1',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    const result = await service.evaluate(multiLineInput);

    expect(result.lineAdjustments).toEqual([
      { lineItemId: 'li-1', promoTotal: -5 },
      { lineItemId: 'li-2', promoTotal: -5 },
    ]);
    expect(result.adjustmentTotal).toBe(-10);
  });

  it('uses findActiveGlobal when storeId is null', async () => {
    promotionRepo.findActiveGlobal.mockResolvedValue([]);

    await service.evaluate({ ...baseInput, storeId: null });

    expect(promotionRepo.findActiveGlobal).toHaveBeenCalled();
    expect(promotionRepo.findActiveByStore).not.toHaveBeenCalled();
  });
});
