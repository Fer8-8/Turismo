import { Test, TestingModule } from '@nestjs/testing';
import { LineItemService } from './line-item.service';
import { LineItemRepository } from '../infrastructure/repositories/line-item.repository';
import { OrderStateService } from './order-state.service';
import { OrderValidationService } from './order-validation.service';
import { OrderPricingService } from './order-pricing.service';
import { OrderState } from '../domain/enums/order-state.enum';
import {
  LineItemQuantityException,
  OrderNotEditableException,
  DuplicateLineItemException,
} from '../domain/exceptions/order.exceptions';

const mockLineItemRepo = {
  create: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findByOrder: jest.fn(),
  findByOrderAndVariant: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockStateService = {
  assertOrderIsEditable: jest.fn(),
};

const mockValidationService = {
  validateAndResolveVariant: jest.fn(),
};

const mockPricingService = {
  recalculate: jest.fn(),
};

const cartOrder = {
  id: 'ord-1',
  state: OrderState.CART,
  shipAddress: { state_id: 'state-1' },
};
const variantData = {
  variantId: 'var-1',
  sku: 'SKU-01',
  productName: 'Prod',
  basePrice: 100,
  currency: 'MXN',
  taxCategoryId: null,
  costPrice: null,
  trackInventory: true,
};

describe('LineItemService', () => {
  let service: LineItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineItemService,
        { provide: LineItemRepository, useValue: mockLineItemRepo },
        { provide: OrderStateService, useValue: mockStateService },
        { provide: OrderValidationService, useValue: mockValidationService },
        { provide: OrderPricingService, useValue: mockPricingService },
      ],
    }).compile();

    service = module.get<LineItemService>(LineItemService);
    jest.clearAllMocks();
  });

  describe('addLineItem', () => {
    beforeEach(() => {
      mockStateService.assertOrderIsEditable.mockResolvedValue(cartOrder);
      mockLineItemRepo.findByOrderAndVariant.mockResolvedValue(null);
      mockValidationService.validateAndResolveVariant.mockResolvedValue(variantData);
      mockLineItemRepo.create.mockResolvedValue({ id: 'li-1', ...variantData });
      mockPricingService.recalculate.mockResolvedValue(undefined);
    });

    it('creates a line item for valid input', async () => {
      const result = await service.addLineItem({
        orderId: 'ord-1',
        variantId: 'var-1',
        quantity: 2,
      });
      expect(mockLineItemRepo.create).toHaveBeenCalled();
      expect(mockPricingService.recalculate).toHaveBeenCalledWith('ord-1', {
        stateId: 'state-1',
      });
      expect(result.id).toBe('li-1');
    });

    it('throws LineItemQuantityException for quantity 0', async () => {
      await expect(
        service.addLineItem({ orderId: 'ord-1', variantId: 'var-1', quantity: 0 }),
      ).rejects.toThrow(LineItemQuantityException);
    });

    it('throws OrderNotEditableException for non-editable order', async () => {
      mockStateService.assertOrderIsEditable.mockRejectedValue(
        new OrderNotEditableException('ord-1', OrderState.CANCELLED),
      );
      await expect(
        service.addLineItem({ orderId: 'ord-1', variantId: 'var-1', quantity: 1 }),
      ).rejects.toThrow(OrderNotEditableException);
    });

    it('throws DuplicateLineItemException when variant already in order', async () => {
      mockLineItemRepo.findByOrderAndVariant.mockResolvedValue({ id: 'li-existing' });
      await expect(
        service.addLineItem({ orderId: 'ord-1', variantId: 'var-1', quantity: 1 }),
      ).rejects.toThrow(DuplicateLineItemException);
    });
  });

  describe('removeLineItem', () => {
    it('deletes the line item', async () => {
      mockStateService.assertOrderIsEditable.mockResolvedValue(cartOrder);
      mockLineItemRepo.findByIdOrThrow.mockResolvedValue({ id: 'li-1' });
      mockLineItemRepo.delete.mockResolvedValue(undefined);
      mockPricingService.recalculate.mockResolvedValue(undefined);

      await service.removeLineItem('ord-1', 'li-1');

      expect(mockLineItemRepo.delete).toHaveBeenCalledWith('li-1');
      expect(mockPricingService.recalculate).toHaveBeenCalledWith('ord-1', {
        stateId: 'state-1',
      });
    });

    it('throws OrderNotEditableException for cancelled order', async () => {
      mockStateService.assertOrderIsEditable.mockRejectedValue(
        new OrderNotEditableException('ord-1', OrderState.CANCELLED),
      );

      await expect(service.removeLineItem('ord-1', 'li-1')).rejects.toThrow(
        OrderNotEditableException,
      );
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity and recalculates totals', async () => {
      mockStateService.assertOrderIsEditable.mockResolvedValue(cartOrder);
      mockLineItemRepo.findByIdOrThrow.mockResolvedValue({
        id: 'li-1',
        variant_id: 'var-1',
      });
      mockValidationService.validateAndResolveVariant.mockResolvedValue(variantData);
      mockLineItemRepo.update.mockResolvedValue({ id: 'li-1', quantity: 3 });
      mockPricingService.recalculate.mockResolvedValue(undefined);

      const result = await service.updateQuantity({
        orderId: 'ord-1',
        lineItemId: 'li-1',
        quantity: 3,
      });

      expect(mockLineItemRepo.update).toHaveBeenCalledWith('li-1', { quantity: 3 });
      expect(mockPricingService.recalculate).toHaveBeenCalledWith('ord-1', {
        stateId: 'state-1',
      });
      expect(result).toEqual({ id: 'li-1', quantity: 3 });
    });
  });

  describe('computeLineSubtotal', () => {
    it('calculates correctly', () => {
      expect(service.computeLineSubtotal(99.99, 3)).toBeCloseTo(299.97);
    });
  });
});
