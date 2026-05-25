import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { BusinessException, AppNotFoundException } from '../../shared/exceptions';

describe('StoreService', () => {
  let service: StoreService;
  let prisma: {
    store: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    productsStore: {
      findFirst: jest.Mock;
      create: jest.Mock;
    };
  };

  const activeStore = {
    id: 'store-1',
    name: 'Centro',
    code: 'CTR',
    is_active: true,
    url: null,
    description: null,
    default_currency: 'MXN',
    default_locale: 'es-MX',
    customer_support_email: null,
    new_order_notifications_email: null,
    mail_from_address: null,
    default_country_id: null,
    checkout_zone_id: null,
    address: null,
    contact_phone: null,
    meta_description: null,
    meta_keywords: null,
    seo_title: null,
    seo_robots: null,
    facebook: null,
    twitter: null,
    instagram: null,
    supported_currencies: null,
    supported_locales: null,
    default: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      store: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      productsStore: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateStoreAccess', () => {
    it('should fail when the store does not exist', async () => {
      prisma.store.findUnique.mockResolvedValueOnce(null);

      await expect(service.validateStoreAccess('missing-store')).rejects.toThrow(
        new AppNotFoundException("Tienda con id 'missing-store' no encontrada"),
      );
    });

    it('should fail when the store exists but is inactive', async () => {
      prisma.store.findUnique
        .mockResolvedValueOnce({ id: 'store-1', is_active: false })
        .mockResolvedValueOnce({ id: 'store-1', is_active: false });

      await expect(service.validateStoreAccess('store-1')).rejects.toThrow(
        new BusinessException("La tienda con id 'store-1' no está activa"),
      );
    });
  });

  describe('assignProductToStore', () => {
    it('should create the assignment once for an active store', async () => {
      prisma.store.findUnique
        .mockResolvedValueOnce(activeStore)
        .mockResolvedValueOnce(activeStore);
      prisma.productsStore.findFirst.mockResolvedValue(null);

      await service.assignProductToStore('store-1', 'product-1');

      expect(prisma.productsStore.create).toHaveBeenCalledWith({
        data: { store_id: 'store-1', product_id: 'product-1' },
      });
    });

    it('should not duplicate the assignment when it already exists', async () => {
      prisma.store.findUnique
        .mockResolvedValueOnce(activeStore)
        .mockResolvedValueOnce(activeStore);
      prisma.productsStore.findFirst.mockResolvedValue({
        id: 'ps-1',
        store_id: 'store-1',
        product_id: 'product-1',
      });

      await service.assignProductToStore('store-1', 'product-1');

      expect(prisma.productsStore.create).not.toHaveBeenCalled();
    });
  });

  describe('resolveStore', () => {
    it('should require a store id or code', async () => {
      await expect(service.resolveStore()).rejects.toThrow(
        new BusinessException('Se debe proporcionar storeId o code'),
      );
    });
  });
});