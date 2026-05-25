import { Test, TestingModule } from '@nestjs/testing';
import { PromotionCodeService } from './promotion-code.service';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { EventBusService } from '../../../core/shared';
import {
  PromoCodeNotFoundException,
  PromotionInactiveException,
  PromotionExpiredException,
  PromotionNotStartedException,
  PromotionUsageLimitExceededException,
} from '../domain/exceptions/promotion.exceptions';

describe('PromotionCodeService', () => {
  let service: PromotionCodeService;
  const promotionRepo = {
    findByCodeOrThrow: jest.fn(),
  };
  const eventBus = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionCodeService,
        { provide: PromotionRepository, useValue: promotionRepo },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get(PromotionCodeService);
    jest.resetAllMocks();
  });

  it('emits validated event when code is accepted', async () => {
    promotionRepo.findByCodeOrThrow.mockResolvedValue({
      id: 'promo-1',
      code: 'SAVE10',
      name: 'Promo',
      active: true,
      starts_at: null,
      expires_at: null,
      usage_limit: 5,
      usage_count: 1,
    });

    const result = await service.validate('SAVE10');

    expect(result.valid).toBe(true);
    expect(eventBus.emit).toHaveBeenCalled();
  });

  it('emits rejected event when code is rejected through check', async () => {
    promotionRepo.findByCodeOrThrow.mockRejectedValue(new Error('not found'));

    const result = await service.check('BADCODE');

    expect(result.valid).toBe(false);
    expect(eventBus.emit).toHaveBeenCalled();
  });

  it('throws PromoCodeNotFoundException when code does not exist', async () => {
    promotionRepo.findByCodeOrThrow.mockRejectedValue(new Error('not found'));
    await expect(service.validate('MISSING')).rejects.toThrow(PromoCodeNotFoundException);
  });

  it('throws PromotionInactiveException when promotion is inactive', async () => {
    promotionRepo.findByCodeOrThrow.mockResolvedValue({
      id: 'promo-1',
      code: 'INACTIVE',
      name: 'Inactive',
      active: false,
      starts_at: null,
      expires_at: null,
      usage_limit: null,
      usage_count: 0,
    });
    await expect(service.validate('INACTIVE')).rejects.toThrow(PromotionInactiveException);
  });

  it('throws PromotionNotStartedException when starts_at is in the future', async () => {
    promotionRepo.findByCodeOrThrow.mockResolvedValue({
      id: 'promo-1',
      code: 'FUTURE',
      name: 'Future',
      active: true,
      starts_at: new Date('2099-01-01'),
      expires_at: null,
      usage_limit: null,
      usage_count: 0,
    });
    await expect(service.validate('FUTURE')).rejects.toThrow(PromotionNotStartedException);
  });

  it('throws PromotionExpiredException when expires_at is in the past', async () => {
    promotionRepo.findByCodeOrThrow.mockResolvedValue({
      id: 'promo-1',
      code: 'EXPIRED',
      name: 'Expired',
      active: true,
      starts_at: null,
      expires_at: new Date('2020-01-01'),
      usage_limit: null,
      usage_count: 0,
    });
    await expect(service.validate('EXPIRED')).rejects.toThrow(PromotionExpiredException);
  });

  it('throws PromotionUsageLimitExceededException when limit exhausted', async () => {
    promotionRepo.findByCodeOrThrow.mockResolvedValue({
      id: 'promo-1',
      code: 'SOLD_OUT',
      name: 'Sold Out',
      active: true,
      starts_at: null,
      expires_at: null,
      usage_limit: 3,
      usage_count: 3,
    });
    await expect(service.validate('SOLD_OUT')).rejects.toThrow(PromotionUsageLimitExceededException);
  });

  it('isCodeMatch is case-insensitive and trims whitespace', () => {
    expect(service.isCodeMatch('save10', '  SAVE10  ')).toBe(true);
    expect(service.isCodeMatch('SAVE10', 'save10')).toBe(true);
    expect(service.isCodeMatch('SAVE10', 'DIFFERENT')).toBe(false);
  });

  it('isCodeMatch returns false when rule code is null', () => {
    expect(service.isCodeMatch(null, 'SAVE10')).toBe(false);
  });

  it('isCodeMatch returns false when provided code is undefined', () => {
    expect(service.isCodeMatch('SAVE10', undefined)).toBe(false);
  });
});
