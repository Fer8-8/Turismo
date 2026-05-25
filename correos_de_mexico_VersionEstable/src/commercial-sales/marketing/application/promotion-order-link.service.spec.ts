import { Test, TestingModule } from '@nestjs/testing';
import { PromotionOrderLinkService } from './promotion-order-link.service';
import { PromotionOrderRepository } from '../infrastructure/repositories/promotion-order.repository';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { EventBusService } from '../../../core/shared';
import { PromotionUsageLimitExceededException } from '../domain/exceptions/promotion.exceptions';

describe('PromotionOrderLinkService', () => {
  let service: PromotionOrderLinkService;
  const promotionOrderRepo = {
    findByOrderAndPromotion: jest.fn(),
    create: jest.fn(),
    findByOrder: jest.fn(),
    deleteLink: jest.fn(),
    deleteByOrder: jest.fn(),
  };
  const promotionRepo = {
    findByIdOrThrow: jest.fn(),
    incrementUsageCount: jest.fn(),
  };
  const eventBus = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionOrderLinkService,
        { provide: PromotionOrderRepository, useValue: promotionOrderRepo },
        { provide: PromotionRepository, useValue: promotionRepo },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get(PromotionOrderLinkService);
    jest.resetAllMocks();
  });

  it('registers an applied promotion with amount and trace metadata', async () => {
    promotionRepo.findByIdOrThrow.mockResolvedValue({
      id: 'promo-1',
      usage_limit: 5,
      usage_count: 2,
    });
    promotionOrderRepo.findByOrderAndPromotion.mockResolvedValue(null);
    promotionOrderRepo.create.mockResolvedValue({ id: 'link-1' });

    await service.link(
      {
        order_id: 'order-1',
        promotion_id: 'promo-1',
        promo_total: -25,
        reason: 'matched_product_rule',
        evaluation_snapshot: JSON.stringify({ appliedPromotionIds: ['promo-1'] }),
      },
      -25,
    );

    expect(promotionOrderRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        promo_total: -25,
        reason: 'matched_product_rule',
      }),
    );
    expect(promotionRepo.incrementUsageCount).toHaveBeenCalledWith('promo-1');
    expect(eventBus.emit).toHaveBeenCalled();
  });

  it('rejects official application when usage limit is exhausted', async () => {
    promotionRepo.findByIdOrThrow.mockResolvedValue({
      id: 'promo-1',
      usage_limit: 2,
      usage_count: 2,
    });

    await expect(
      service.link({ order_id: 'order-1', promotion_id: 'promo-1' }, -10),
    ).rejects.toBeInstanceOf(PromotionUsageLimitExceededException);

    expect(promotionOrderRepo.create).not.toHaveBeenCalled();
  });
});
