import { Test, TestingModule } from '@nestjs/testing';
import { OrderPricingService } from './order-pricing.service';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { TaxFacade } from '../../../location/tax/facades/tax.facade';
import { LineItemRepository } from '../infrastructure/repositories/line-item.repository';
import { PROMOTION_GATEWAY } from '../../contracts/promotion-evaluation.contract';

const mockOrderRepo = {
  findLineItemsForTotals: jest.fn(),
  findByIdOrThrow: jest.fn(),
  updateTotals: jest.fn(),
};

const mockLineItemRepo = {
  updateManyPricing: jest.fn(),
};

const mockTaxFacade = {
  calculateOrderTax: jest.fn(),
};

const mockPromotionGateway = {
  evaluateOrderPromotions: jest.fn(),
};

const baseLineItems = [
  {
    id: 'li-1',
    price: 100,
    quantity: 2,
    adjustment_total: 0,
    promo_total: 0,
    additional_tax_total: 0,
    included_tax_total: 0,
    pre_tax_amount: 0,
    tax_category_id: 'tax-cat-1',
    variant_id: 'var-1',
  },
];

describe('OrderPricingService', () => {
  let service: OrderPricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderPricingService,
        { provide: OrderRepository, useValue: mockOrderRepo },
        { provide: LineItemRepository, useValue: mockLineItemRepo },
        { provide: TaxFacade, useValue: mockTaxFacade },
        { provide: PROMOTION_GATEWAY, useValue: mockPromotionGateway },
      ],
    }).compile();

    service = module.get<OrderPricingService>(OrderPricingService);
    jest.clearAllMocks();
  });

  it('zeros all totals when no line items', async () => {
    mockOrderRepo.findLineItemsForTotals.mockResolvedValue([]);
    mockOrderRepo.updateTotals.mockResolvedValue(undefined);

    await service.recalculate('ord-1');

    expect(mockOrderRepo.updateTotals).toHaveBeenCalledWith(
      'ord-1',
      expect.objectContaining({ total: 0, item_count: 0 }),
    );
  });

  it('calculates correct totals with tax result', async () => {
    mockOrderRepo.findLineItemsForTotals.mockResolvedValue([{ price: 100, quantity: 2 }]);
    mockOrderRepo.findByIdOrThrow.mockResolvedValue({
      id: 'ord-1',
      user_id: 'user-1',
      store_id: 'store-1',
      currency: 'MXN',
      lineItems: baseLineItems,
    });
    mockTaxFacade.calculateOrderTax.mockResolvedValue({
      additional_tax_total: 32,
      included_tax_total: 0,
      line_items_tax: 32,
      shipment_tax: 0,
      breakdown: [{ additional_tax: 32, included_tax: 0 }],
    });
    mockPromotionGateway.evaluateOrderPromotions.mockResolvedValue({
      orderPromoTotal: 0,
      lineAdjustments: [{ lineItemId: 'li-1', promoTotal: -15 }],
      adjustmentTotal: -15,
    });
    mockLineItemRepo.updateManyPricing.mockResolvedValue(undefined);
    mockOrderRepo.updateTotals.mockResolvedValue(undefined);

    await service.recalculate('ord-1');

    expect(mockLineItemRepo.updateManyPricing).toHaveBeenCalledWith([
      {
        id: 'li-1',
        pre_tax_amount: 200,
        additional_tax_total: 32,
        included_tax_total: 0,
        promo_total: -15,
        adjustment_total: 0,
      },
    ]);
    expect(mockOrderRepo.updateTotals).toHaveBeenCalledWith(
      'ord-1',
      expect.objectContaining({
        item_total: 200,
        item_count: 2,
        additional_tax_total: 32,
        promo_total: -15,
        total: 217,
      }),
    );
  });

  it('integrates included_tax: reduces pre_tax_amount without affecting total', async () => {
    mockOrderRepo.findLineItemsForTotals.mockResolvedValue([{ price: 100, quantity: 1 }]);
    mockOrderRepo.findByIdOrThrow.mockResolvedValue({
      id: 'ord-1',
      user_id: 'u1',
      store_id: 's1',
      currency: 'MXN',
      lineItems: [
        {
          id: 'li-1',
          price: 100,
          quantity: 1,
          adjustment_total: 0,
          promo_total: 0,
          additional_tax_total: 0,
          included_tax_total: 0,
          tax_category_id: 'tc-1',
          variant_id: 'var-1',
        },
      ],
    });
    mockTaxFacade.calculateOrderTax.mockResolvedValue({
      additional_tax_total: 0,
      included_tax_total: 16,
      breakdown: [{ additional_tax: 0, included_tax: 16 }],
    });
    mockPromotionGateway.evaluateOrderPromotions.mockResolvedValue({
      orderPromoTotal: 0,
      lineAdjustments: [],
      adjustmentTotal: 0,
    });
    mockLineItemRepo.updateManyPricing.mockResolvedValue(undefined);
    mockOrderRepo.updateTotals.mockResolvedValue(undefined);

    await service.recalculate('ord-1');

    // pre_tax_amount = lineSubtotal - included_tax = 100 - 16 = 84
    expect(mockLineItemRepo.updateManyPricing).toHaveBeenCalledWith([
      expect.objectContaining({
        pre_tax_amount: 84,
        included_tax_total: 16,
        additional_tax_total: 0,
      }),
    ]);
    // total does NOT include included_tax (it was already in the price)
    expect(mockOrderRepo.updateTotals).toHaveBeenCalledWith(
      'ord-1',
      expect.objectContaining({
        item_total: 100,
        included_tax_total: 16,
        additional_tax_total: 0,
        total: 100, // included_tax is not additive
      }),
    );
  });

  it('stacks order-level and line-level promo totals correctly', async () => {
    const twoLines = [
      {
        id: 'li-1',
        price: 100,
        quantity: 2,
        adjustment_total: 0,
        promo_total: 0,
        additional_tax_total: 0,
        included_tax_total: 0,
        tax_category_id: null,
        variant_id: 'var-1',
      },
      {
        id: 'li-2',
        price: 50,
        quantity: 1,
        adjustment_total: 0,
        promo_total: 0,
        additional_tax_total: 0,
        included_tax_total: 0,
        tax_category_id: null,
        variant_id: 'var-2',
      },
    ];
    mockOrderRepo.findLineItemsForTotals.mockResolvedValue([{}, {}]);
    mockOrderRepo.findByIdOrThrow.mockResolvedValue({
      id: 'ord-1',
      user_id: 'u1',
      store_id: 's1',
      currency: 'MXN',
      lineItems: twoLines,
    });
    mockTaxFacade.calculateOrderTax.mockResolvedValue({
      additional_tax_total: 0,
      included_tax_total: 0,
      breakdown: [
        { additional_tax: 0, included_tax: 0 },
        { additional_tax: 0, included_tax: 0 },
      ],
    });
    // Order-level: -30, line-level: li-1 gets -20
    mockPromotionGateway.evaluateOrderPromotions.mockResolvedValue({
      orderPromoTotal: -30,
      lineAdjustments: [{ lineItemId: 'li-1', promoTotal: -20 }],
      adjustmentTotal: -50,
    });
    mockLineItemRepo.updateManyPricing.mockResolvedValue(undefined);
    mockOrderRepo.updateTotals.mockResolvedValue(undefined);

    await service.recalculate('ord-1');

    // item_total = 200 + 50 = 250; promo_total = -30 (order) + -20 (line) = -50
    expect(mockOrderRepo.updateTotals).toHaveBeenCalledWith(
      'ord-1',
      expect.objectContaining({
        item_total: 250,
        promo_total: -50,
        total: 200, // 250 + 0 + (-50) + 0 + 0
      }),
    );
  });

  it('passes itemTotal and lineItems correctly to PromotionGateway', async () => {
    mockOrderRepo.findLineItemsForTotals.mockResolvedValue([{ price: 100, quantity: 3 }]);
    mockOrderRepo.findByIdOrThrow.mockResolvedValue({
      id: 'ord-1',
      user_id: 'u1',
      store_id: 's1',
      currency: 'MXN',
      lineItems: [
        {
          id: 'li-1',
          price: 100,
          quantity: 3,
          adjustment_total: 0,
          promo_total: 0,
          additional_tax_total: 0,
          included_tax_total: 0,
          tax_category_id: null,
          variant_id: 'var-1',
        },
      ],
    });
    mockTaxFacade.calculateOrderTax.mockResolvedValue({
      additional_tax_total: 0,
      included_tax_total: 0,
      breakdown: [{ additional_tax: 0, included_tax: 0 }],
    });
    mockPromotionGateway.evaluateOrderPromotions.mockResolvedValue({
      orderPromoTotal: 0,
      lineAdjustments: [],
      adjustmentTotal: 0,
    });
    mockLineItemRepo.updateManyPricing.mockResolvedValue(undefined);
    mockOrderRepo.updateTotals.mockResolvedValue(undefined);

    await service.recalculate('ord-1');

    expect(mockPromotionGateway.evaluateOrderPromotions).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'ord-1',
        userId: 'u1',
        storeId: 's1',
        itemTotal: 300, // 100 × 3
        lineItems: [
          expect.objectContaining({
            lineItemId: 'li-1',
            variantId: 'var-1',
            quantity: 3,
            unitPrice: 100,
            lineSubtotal: 300,
          }),
        ],
      }),
    );
  });
});
