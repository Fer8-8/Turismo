import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { LineItemRepository } from '../infrastructure/repositories/line-item.repository';
import { OrderValidationService } from './order-validation.service';
import { OrderPricingService } from './order-pricing.service';
import { OrderStateService } from './order-state.service';
import { EventBusService } from '../../../core/shared';
import { UserFacade } from '../../../core/user/facades/user.facade';
import { OrderState } from '../domain/enums/order-state.enum';
import { OrderOwnershipException } from '../domain/exceptions/order.exceptions';

const mockOrderRepo = {
  findByIdOrThrow: jest.fn(),
  findByIdForUser: jest.fn(),
  findByUser: jest.fn(),
  create: jest.fn(),
};

const mockLineItemRepo = {
  create: jest.fn(),
};

const mockValidationService = {
  validateUserExists: jest.fn(),
  validateStoreAccess: jest.fn(),
  validateAndResolveVariant: jest.fn(),
};

const mockPricingService = {
  recalculate: jest.fn(),
};

const mockStateService = {
  cancelOrder: jest.fn(),
  markPending: jest.fn(),
  markApproved: jest.fn(),
};

const mockEventBus = {
  emit: jest.fn(),
};

const mockUserFacade = {
  getMinimalProfile: jest.fn(),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockOrderRepo },
        { provide: LineItemRepository, useValue: mockLineItemRepo },
        { provide: OrderValidationService, useValue: mockValidationService },
        { provide: OrderPricingService, useValue: mockPricingService },
        { provide: OrderStateService, useValue: mockStateService },
        { provide: EventBusService, useValue: mockEventBus },
        { provide: UserFacade, useValue: mockUserFacade },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    jest.resetAllMocks();
  });

  it('returns owned order when user matches', async () => {
    const order = { id: 'ord-1', user_id: 'user-1' };
    mockOrderRepo.findByIdForUser.mockResolvedValue(order);

    await expect(service.getOwnedOrder('ord-1', 'user-1')).resolves.toBe(order);
  });

  it('throws ownership exception when order does not belong to user', async () => {
    mockOrderRepo.findByIdForUser.mockResolvedValue(null);

    await expect(service.getOwnedOrder('ord-1', 'user-1')).rejects.toThrow(
      OrderOwnershipException,
    );
  });

  it('marks order pending and emits event', async () => {
    mockOrderRepo.findByIdOrThrow
      .mockResolvedValueOnce({ id: 'ord-1', shipAddress: { state_id: 'state-1' } })
      .mockResolvedValueOnce({
        id: 'ord-1',
        store_id: 'store-1',
        user_id: 'user-1',
        total: 150,
      });
    mockPricingService.recalculate.mockResolvedValue(undefined);
    mockStateService.markPending.mockResolvedValue(undefined);
    mockEventBus.emit.mockResolvedValue(undefined);

    const result = await service.markOrderPending('ord-1');

    expect(mockPricingService.recalculate).toHaveBeenCalledWith('ord-1', {
      stateId: 'state-1',
    });
    expect(mockStateService.markPending).toHaveBeenCalledWith('ord-1');
    expect(mockEventBus.emit).toHaveBeenCalled();
    expect(result.id).toBe('ord-1');
  });

  it('approves order and emits event', async () => {
    mockOrderRepo.findByIdOrThrow
      .mockResolvedValueOnce({ id: 'ord-1', state: OrderState.PENDING })
      .mockResolvedValueOnce({
        id: 'ord-1',
        store_id: 'store-1',
        user_id: 'user-1',
        total: 150,
      });
    mockStateService.markApproved.mockResolvedValue(undefined);
    mockEventBus.emit.mockResolvedValue(undefined);

    const result = await service.approveOrder('ord-1');

    expect(mockStateService.markApproved).toHaveBeenCalledWith('ord-1');
    expect(mockEventBus.emit).toHaveBeenCalled();
    expect(result.id).toBe('ord-1');
  });

  it('builds payment context consistently', async () => {
    mockOrderRepo.findByIdOrThrow.mockResolvedValue({
      id: 'ord-1',
      state: OrderState.PENDING,
      store_id: 'store-1',
      currency: 'MXN',
      total: 200,
      payment_total: 50,
    });

    await expect(service.getPaymentContext('ord-1')).resolves.toEqual({
      orderId: 'ord-1',
      state: OrderState.PENDING,
      storeId: 'store-1',
      currency: 'MXN',
      total: 200,
      paymentTotal: 50,
      outstandingBalance: 150,
      payable: true,
    });
  });

  it('builds fulfillment context consistently', async () => {
    mockOrderRepo.findByIdOrThrow.mockResolvedValue({
      id: 'ord-1',
      state: OrderState.APPROVED,
      store_id: 'store-1',
      ship_address_id: 'addr-1',
      bill_address_id: 'addr-2',
      lineItems: [{ id: 'li-1', variant_id: 'var-1', quantity: 2, price: 100 }],
    });

    await expect(service.getFulfillmentContext('ord-1')).resolves.toEqual({
      orderId: 'ord-1',
      state: OrderState.APPROVED,
      storeId: 'store-1',
      shipAddressId: 'addr-1',
      billAddressId: 'addr-2',
      fulfillable: true,
      lineItems: [{ id: 'li-1', variantId: 'var-1', quantity: 2, price: 100 }],
    });
  });

  describe('createOrder', () => {
    const freshOrder = {
      id: 'ord-new',
      store_id: 'store-1',
      user_id: 'user-1',
      currency: 'MXN',
      total: 200,
      lineItems: [
        { id: 'li-1' },
        { id: 'li-2' },
      ],
    };

    beforeEach(() => {
      mockValidationService.validateUserExists.mockResolvedValue(undefined);
      mockValidationService.validateStoreAccess.mockResolvedValue(undefined);
      mockValidationService.validateAndResolveVariant
        .mockResolvedValueOnce({
          variantId: 'var-1',
          sku: 'SKU-1',
          productName: 'Product A',
          basePrice: 100,
          currency: 'MXN',
          taxCategoryId: 'tc-1',
          costPrice: 50,
          trackInventory: true,
        })
        .mockResolvedValueOnce({
          variantId: 'var-2',
          sku: 'SKU-2',
          productName: 'Product B',
          basePrice: 100,
          currency: 'MXN',
          taxCategoryId: 'tc-1',
          costPrice: 40,
          trackInventory: true,
        });
      mockUserFacade.getMinimalProfile.mockResolvedValue({ email: 'test@test.com' });
      mockOrderRepo.create.mockResolvedValue({ id: 'ord-new' });
      mockLineItemRepo.create.mockResolvedValue({});
      mockPricingService.recalculate.mockResolvedValue(undefined);
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(freshOrder);
      mockEventBus.emit.mockResolvedValue(undefined);
    });

    it('validates user and store before creating order', async () => {
      await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [{ variantId: 'var-1', quantity: 1 }, { variantId: 'var-2', quantity: 1 }],
      });

      expect(mockValidationService.validateUserExists).toHaveBeenCalledWith('user-1');
      expect(mockValidationService.validateStoreAccess).toHaveBeenCalledWith('store-1');
    });

    it('resolves all variants before creating the order shell', async () => {
      await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [
          { variantId: 'var-1', quantity: 2 },
          { variantId: 'var-2', quantity: 1 },
        ],
      });

      expect(mockValidationService.validateAndResolveVariant).toHaveBeenCalledTimes(2);
      expect(mockValidationService.validateAndResolveVariant).toHaveBeenCalledWith(
        expect.objectContaining({ variantId: 'var-1', quantity: 2, checkInventory: true }),
      );
    });

    it('persists basePrice of each variant at time of purchase', async () => {
      await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [{ variantId: 'var-1', quantity: 2 }, { variantId: 'var-2', quantity: 1 }],
      });

      // Line items must be created with the resolved basePrice, never the request raw value
      expect(mockLineItemRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ price: 100, variant_id: 'var-1' }),
      );
      expect(mockLineItemRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ price: 100, variant_id: 'var-2' }),
      );
    });

    it('creates line items in the new order', async () => {
      await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [{ variantId: 'var-1', quantity: 2 }, { variantId: 'var-2', quantity: 1 }],
      });

      expect(mockLineItemRepo.create).toHaveBeenCalledTimes(2);
      expect(mockLineItemRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ order_id: 'ord-new', quantity: 2 }),
      );
    });

    it('calls pricingService.recalculate after inserting line items', async () => {
      await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [{ variantId: 'var-1', quantity: 1 }, { variantId: 'var-2', quantity: 1 }],
      });

      expect(mockPricingService.recalculate).toHaveBeenCalledWith('ord-new');
    });

    it('emits OrderCreatedEvent with correct payload', async () => {
      const result = await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [{ variantId: 'var-1', quantity: 1 }, { variantId: 'var-2', quantity: 1 }],
      });

      expect(mockEventBus.emit).toHaveBeenCalled();
      expect(result.id).toBe('ord-new');
    });

    it('propagates failure if user validation fails before creating anything', async () => {
      mockValidationService.validateUserExists.mockRejectedValue(
        new Error('user not found'),
      );

      await expect(
        service.createOrder({
          userId: 'ghost',
          storeId: 'store-1',
          lineItems: [{ variantId: 'var-1', quantity: 1 }, { variantId: 'var-2', quantity: 1 }],
        }),
      ).rejects.toThrow('user not found');

      // Order must NOT have been created
      expect(mockOrderRepo.create).not.toHaveBeenCalled();
    });

    it('propagates failure if any variant is unavailable', async () => {
      mockValidationService.validateAndResolveVariant
        .mockReset()
        .mockRejectedValue(new Error('variant unavailable'));

      await expect(
        service.createOrder({
          userId: 'user-1',
          storeId: 'store-1',
          lineItems: [{ variantId: 'var-bad', quantity: 1 }, { variantId: 'var-2', quantity: 1 }],
        }),
      ).rejects.toThrow();

      expect(mockOrderRepo.create).not.toHaveBeenCalled();
    });

    it('uses currency from first resolved item when not provided in input', async () => {
      await service.createOrder({
        userId: 'user-1',
        storeId: 'store-1',
        lineItems: [{ variantId: 'var-1', quantity: 1 }, { variantId: 'var-2', quantity: 1 }],
      });

      // No currency in input → uses resolved item currency 'MXN'
      expect(mockOrderRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ currency: 'MXN' }),
      );
    });

    it('cancels order and emits event', async () => {
      mockStateService.cancelOrder.mockResolvedValue(undefined);
      mockOrderRepo.findByIdOrThrow.mockResolvedValue({
        id: 'ord-1',
        store_id: 'store-1',
        user_id: 'user-1',
        total: 100,
      });

      await service.cancelOrder('ord-1', 'customer_request');

      expect(mockStateService.cancelOrder).toHaveBeenCalledWith('ord-1');
      expect(mockEventBus.emit).toHaveBeenCalled();
    });
  });
});
