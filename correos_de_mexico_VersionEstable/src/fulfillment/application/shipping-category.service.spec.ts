import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCategoryService } from './shipping-category.service';
import { ShippingCategoryRepository } from '../infrastructure/repositories/shipping-category.repository';
import { ShippingMethodRepository } from '../infrastructure/repositories/shipping-method.repository';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { BusinessException } from '../../core/shared';

describe('ShippingCategoryService', () => {
  let service: ShippingCategoryService;
  let categoryRepo: {
    findByIdOrThrow: jest.Mock;
    associateMethod: jest.Mock;
  };
  let methodRepo: {
    findByIdOrThrow: jest.Mock;
  };

  beforeEach(async () => {
    categoryRepo = {
      findByIdOrThrow: jest.fn(),
      associateMethod: jest.fn(),
    };
    methodRepo = {
      findByIdOrThrow: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingCategoryService,
        { provide: ShippingCategoryRepository, useValue: categoryRepo },
        { provide: ShippingMethodRepository, useValue: methodRepo },
        { provide: StoreFacade, useValue: { validateStoreAccess: jest.fn() } },
      ],
    }).compile();

    service = module.get<ShippingCategoryService>(ShippingCategoryService);
  });

  it('rejects associating store-scoped methods and categories from different stores', async () => {
    methodRepo.findByIdOrThrow.mockResolvedValue({
      id: 'method-1',
      is_global: false,
      store_id: 'store-a',
    });
    categoryRepo.findByIdOrThrow.mockResolvedValue({
      id: 'category-1',
      is_global: false,
      store_id: 'store-b',
    });

    await expect(
      service.associateMethodToCategory('method-1', 'category-1'),
    ).rejects.toThrow(BusinessException);

    expect(categoryRepo.associateMethod).not.toHaveBeenCalled();
  });
});