import { Test, TestingModule } from '@nestjs/testing';
import { SalesResolver } from './sales.resolver';
import { SalesFacade } from '../../facades/sales.facade';

const mockSalesFacade = {
  createOrder: jest.fn(),
  getOrder: jest.fn(),
  getOrderByNumber: jest.fn(),
  cancelOrder: jest.fn(),
  markOrderPending: jest.fn(),
  approveOrder: jest.fn(),
  getOrderHistory: jest.fn(),
  getOwnedOrder: jest.fn(),
  addLineItem: jest.fn(),
  updateLineItemQuantity: jest.fn(),
  removeLineItem: jest.fn(),
  getLineItems: jest.fn(),
  assignAddresses: jest.fn(),
  recalculateOrderTotals: jest.fn(),
  getPaymentContext: jest.fn(),
  getFulfillmentContext: jest.fn(),
  getCommercialContext: jest.fn(),
};

describe('SalesResolver', () => {
  let resolver: SalesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesResolver,
        { provide: SalesFacade, useValue: mockSalesFacade },
      ],
    }).compile();

    resolver = module.get(SalesResolver);
    jest.clearAllMocks();
  });

  describe('getOrder', () => {
    it('queries facade with the given id', async () => {
      const order = { id: 'ord-1' };
      mockSalesFacade.getOrder.mockResolvedValue(order);

      const result = await resolver.getOrder('ord-1');

      expect(mockSalesFacade.getOrder).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(order);
    });
  });

  describe('getOrderByNumber', () => {
    it('queries facade with the order number', async () => {
      const order = { number: 'R100' };
      mockSalesFacade.getOrderByNumber.mockResolvedValue(order);

      const result = await resolver.getOrderByNumber('R100');

      expect(mockSalesFacade.getOrderByNumber).toHaveBeenCalledWith('R100');
      expect(result).toBe(order);
    });
  });

  describe('getOwnedOrder', () => {
    it('passes orderId, userId, and optional storeId to facade', async () => {
      const order = { id: 'ord-1' };
      mockSalesFacade.getOwnedOrder.mockResolvedValue(order);
      const input = { orderId: 'ord-1', userId: 'u-1', storeId: 's-1' };

      const result = await resolver.getOwnedOrder(input as any);

      expect(mockSalesFacade.getOwnedOrder).toHaveBeenCalledWith('ord-1', 'u-1', 's-1');
      expect(result).toBe(order);
    });
  });

  describe('createOrder', () => {
    it('maps input and delegates to facade.createOrder', async () => {
      const order = { id: 'ord-new' };
      mockSalesFacade.createOrder.mockResolvedValue(order);
      const input = {
        userId: 'u-1',
        storeId: 's-1',
        currency: 'MXN',
        channel: 'WEB',
        lineItems: [{ variantId: 'var-1', quantity: 2 }],
      };

      const result = await resolver.createOrder(input as any);

      expect(mockSalesFacade.createOrder).toHaveBeenCalledWith({
        userId: 'u-1',
        storeId: 's-1',
        currency: 'MXN',
        channel: 'WEB',
        lineItems: [{ variantId: 'var-1', quantity: 2 }],
      });
      expect(result).toBe(order);
    });
  });

  describe('addLineItem', () => {
    it('maps input and delegates to facade.addLineItem', async () => {
      const lineItem = { id: 'li-1' };
      mockSalesFacade.addLineItem.mockResolvedValue(lineItem);
      const input = { orderId: 'ord-1', variantId: 'var-1', quantity: 3 };

      const result = await resolver.addLineItem(input as any);

      expect(mockSalesFacade.addLineItem).toHaveBeenCalledWith({
        orderId: 'ord-1',
        variantId: 'var-1',
        quantity: 3,
      });
      expect(result).toBe(lineItem);
    });
  });

  describe('updateLineItemQuantity', () => {
    it('maps input and delegates to facade.updateLineItemQuantity', async () => {
      const lineItem = { id: 'li-1', quantity: 5 };
      mockSalesFacade.updateLineItemQuantity.mockResolvedValue(lineItem);
      const input = { orderId: 'ord-1', lineItemId: 'li-1', quantity: 5 };

      const result = await resolver.updateLineItemQuantity(input as any);

      expect(mockSalesFacade.updateLineItemQuantity).toHaveBeenCalledWith({
        lineItemId: 'li-1',
        orderId: 'ord-1',
        quantity: 5,
      });
      expect(result).toBe(lineItem);
    });
  });

  describe('removeLineItem', () => {
    it('delegates to facade and returns true', async () => {
      mockSalesFacade.removeLineItem.mockResolvedValue(undefined);
      const input = { orderId: 'ord-1', lineItemId: 'li-1' };

      const result = await resolver.removeLineItem(input as any);

      expect(mockSalesFacade.removeLineItem).toHaveBeenCalledWith('ord-1', 'li-1');
      expect(result).toBe(true);
    });
  });

  describe('assignOrderAddress', () => {
    it('maps input and delegates to facade.assignAddresses', async () => {
      const order = { id: 'ord-1' };
      mockSalesFacade.assignAddresses.mockResolvedValue(order);
      const input = { orderId: 'ord-1', shipAddressId: 'addr-ship', billAddressId: 'addr-bill' };

      const result = await resolver.assignOrderAddress(input as any);

      expect(mockSalesFacade.assignAddresses).toHaveBeenCalledWith({
        orderId: 'ord-1',
        shipAddressId: 'addr-ship',
        billAddressId: 'addr-bill',
      });
      expect(result).toBe(order);
    });
  });

  describe('cancelOrder', () => {
    it('delegates orderId and reason to facade.cancelOrder', async () => {
      const order = { id: 'ord-1', state: 'CANCELLED' };
      mockSalesFacade.cancelOrder.mockResolvedValue(order);
      const input = { orderId: 'ord-1', reason: 'customer request' };

      const result = await resolver.cancelOrder(input as any);

      expect(mockSalesFacade.cancelOrder).toHaveBeenCalledWith('ord-1', 'customer request');
      expect(result).toBe(order);
    });
  });

  describe('markOrderPending', () => {
    it('delegates orderId to facade.markOrderPending', async () => {
      const order = { id: 'ord-1', state: 'PENDING' };
      mockSalesFacade.markOrderPending.mockResolvedValue(order);
      const input = { orderId: 'ord-1' };

      const result = await resolver.markOrderPending(input as any);

      expect(mockSalesFacade.markOrderPending).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(order);
    });
  });

  describe('approveOrder', () => {
    it('delegates orderId to facade.approveOrder', async () => {
      const order = { id: 'ord-1', state: 'APPROVED' };
      mockSalesFacade.approveOrder.mockResolvedValue(order);
      const input = { orderId: 'ord-1' };

      const result = await resolver.approveOrder(input as any);

      expect(mockSalesFacade.approveOrder).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(order);
    });
  });

  describe('getOrderPaymentContext', () => {
    it('delegates orderId to facade.getPaymentContext', async () => {
      const ctx = { total: 200, payment_total: 0 };
      mockSalesFacade.getPaymentContext.mockResolvedValue(ctx);
      const input = { orderId: 'ord-1' };

      const result = await resolver.getOrderPaymentContext(input as any);

      expect(mockSalesFacade.getPaymentContext).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(ctx);
    });
  });

  describe('getOrderFulfillmentContext', () => {
    it('delegates orderId to facade.getFulfillmentContext', async () => {
      const ctx = { lineItems: [] };
      mockSalesFacade.getFulfillmentContext.mockResolvedValue(ctx);
      const input = { orderId: 'ord-1' };

      const result = await resolver.getOrderFulfillmentContext(input as any);

      expect(mockSalesFacade.getFulfillmentContext).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(ctx);
    });
  });

  describe('recalculateOrderTotals', () => {
    it('delegates orderId to facade.recalculateOrderTotals', async () => {
      const order = { id: 'ord-1', total: 250 };
      mockSalesFacade.recalculateOrderTotals.mockResolvedValue(order);

      const result = await resolver.recalculateOrderTotals('ord-1');

      expect(mockSalesFacade.recalculateOrderTotals).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(order);
    });
  });
});
