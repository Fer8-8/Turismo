import { Test, TestingModule } from '@nestjs/testing';
import { OrderStateService } from './order-state.service';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderState } from '../domain/enums/order-state.enum';
import {
  OrderAlreadyCancelledException,
  InvalidOrderStateTransitionException,
  OrderNotEditableException,
  OrderNotFulfillabeException,
  OrderNotPayableException,
} from '../domain/exceptions/order.exceptions';

const mockOrderRepo = {
  findByIdOrThrow: jest.fn(),
  updateState: jest.fn(),
};

const makeOrder = (state: OrderState) => ({ id: 'ord-1', state });

describe('OrderStateService', () => {
  let service: OrderStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderStateService,
        { provide: OrderRepository, useValue: mockOrderRepo },
      ],
    }).compile();

    service = module.get<OrderStateService>(OrderStateService);
    jest.clearAllMocks();
  });

  describe('transitionTo', () => {
    it('transitions cart → address', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.CART));
      mockOrderRepo.updateState.mockResolvedValue(undefined);

      await service.transitionTo('ord-1', OrderState.ADDRESS);

      expect(mockOrderRepo.updateState).toHaveBeenCalledWith('ord-1', OrderState.ADDRESS);
    });

    it('transitions cart → cancelled', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.CART));
      await service.transitionTo('ord-1', OrderState.CANCELLED);
      expect(mockOrderRepo.updateState).toHaveBeenCalledWith('ord-1', OrderState.CANCELLED);
    });

    it('throws for invalid transition address → cart', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.ADDRESS));
      await expect(
        service.transitionTo('ord-1', OrderState.CART),
      ).rejects.toThrow(InvalidOrderStateTransitionException);
    });

    it('throws OrderAlreadyCancelledException when already cancelled', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.CANCELLED));
      await expect(
        service.transitionTo('ord-1', OrderState.ADDRESS),
      ).rejects.toThrow(OrderAlreadyCancelledException);
    });
  });

  describe('cancelOrder', () => {
    it('cancels a cart order', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.CART));
      await service.cancelOrder('ord-1');
      expect(mockOrderRepo.updateState).toHaveBeenCalledWith('ord-1', OrderState.CANCELLED);
    });

    it('throws if order already cancelled', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.CANCELLED));
      await expect(service.cancelOrder('ord-1')).rejects.toThrow(
        OrderAlreadyCancelledException,
      );
    });
  });

  describe('isEditableState', () => {
    it('returns true for cart and address', () => {
      expect(service.isEditableState(OrderState.CART)).toBe(true);
      expect(service.isEditableState(OrderState.ADDRESS)).toBe(true);
    });

    it('returns false for cancelled', () => {
      expect(service.isEditableState(OrderState.CANCELLED)).toBe(false);
    });
  });

  describe('markPending', () => {
    it('transitions address → pending', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.ADDRESS));

      await service.markPending('ord-1');

      expect(mockOrderRepo.updateState).toHaveBeenCalledWith('ord-1', OrderState.PENDING);
    });
  });

  describe('markApproved', () => {
    it('transitions pending → approved', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(makeOrder(OrderState.PENDING));

      await service.markApproved('ord-1');

      expect(mockOrderRepo.updateState).toHaveBeenCalledWith('ord-1', OrderState.APPROVED);
    });
  });

  describe('payable and fulfillable helpers', () => {
    it('recognizes payable states', () => {
      expect(service.isPayableState(OrderState.PENDING)).toBe(true);
      expect(service.isPayableState(OrderState.APPROVED)).toBe(true);
      expect(service.isPayableState(OrderState.CART)).toBe(false);
    });

    it('recognizes fulfillable states', () => {
      expect(service.isFulfillabeState(OrderState.APPROVED)).toBe(true);
      expect(service.isFulfillabeState(OrderState.PENDING)).toBe(false);
    });

    it('throws for non-payable state assertions', () => {
      expect(() => service.assertOrderIsPayable('ord-1', OrderState.CART)).toThrow(
        OrderNotPayableException,
      );
    });

    it('throws for non-fulfillable state assertions', () => {
      expect(() =>
        service.assertOrderIsFulfillabe('ord-1', OrderState.PENDING),
      ).toThrow(OrderNotFulfillabeException);
    });
  });

  describe('assertOrderIsEditable', () => {
    it('returns the order when state is editable', async () => {
      const order = makeOrder(OrderState.CART);
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(order);

      await expect(service.assertOrderIsEditable('ord-1')).resolves.toBe(order);
    });

    it('throws when state is not editable', async () => {
      mockOrderRepo.findByIdOrThrow.mockResolvedValue(
        makeOrder(OrderState.CANCELLED),
      );

      await expect(service.assertOrderIsEditable('ord-1')).rejects.toThrow(
        OrderNotEditableException,
      );
    });
  });
});
