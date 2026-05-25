import { SalesFacade } from './sales.facade';

const makeOrderService = () => ({
  createOrder: jest.fn(),
  getOrder: jest.fn(),
  getOrderByNumber: jest.fn(),
  cancelOrder: jest.fn(),
  markOrderPending: jest.fn(),
  approveOrder: jest.fn(),
  getOrderHistory: jest.fn(),
  getOwnedOrder: jest.fn(),
  validateOrderOwnership: jest.fn(),
  getPaymentContext: jest.fn(),
  getFulfillmentContext: jest.fn(),
  getCommercialContext: jest.fn(),
});

const makeLineItemService = () => ({
  addLineItem: jest.fn(),
  updateQuantity: jest.fn(),
  removeLineItem: jest.fn(),
  getLineItems: jest.fn(),
});

const makeOrderAddressService = () => ({
  assignAddresses: jest.fn(),
});

const makePricingService = () => ({
  recalculate: jest.fn(),
});

const makeFacade = () => {
  const orderService = makeOrderService();
  const lineItemService = makeLineItemService();
  const orderAddressService = makeOrderAddressService();
  const pricingService = makePricingService();
  const facade = new SalesFacade(
    orderService as any,
    lineItemService as any,
    orderAddressService as any,
    pricingService as any,
  );
  return { facade, orderService, lineItemService, orderAddressService, pricingService };
};

describe('SalesFacade', () => {
  describe('createOrder', () => {
    it('delegates to orderService.createOrder with full input', async () => {
      const { facade, orderService } = makeFacade();
      const input = { userId: 'u-1', storeId: 's-1', currency: 'MXN', lineItems: [] };
      const order = { id: 'ord-1' };
      orderService.createOrder.mockResolvedValue(order);

      const result = await facade.createOrder(input as any);

      expect(orderService.createOrder).toHaveBeenCalledWith(input);
      expect(result).toBe(order);
    });
  });

  describe('getOrder', () => {
    it('delegates to orderService.getOrder', async () => {
      const { facade, orderService } = makeFacade();
      const order = { id: 'ord-1' };
      orderService.getOrder.mockResolvedValue(order);

      const result = await facade.getOrder('ord-1');

      expect(orderService.getOrder).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(order);
    });
  });

  describe('getOrderByNumber', () => {
    it('delegates to orderService.getOrderByNumber', async () => {
      const { facade, orderService } = makeFacade();
      orderService.getOrderByNumber.mockResolvedValue({ number: 'R100' });

      await facade.getOrderByNumber('R100');

      expect(orderService.getOrderByNumber).toHaveBeenCalledWith('R100');
    });
  });

  describe('cancelOrder', () => {
    it('delegates reason to orderService.cancelOrder', async () => {
      const { facade, orderService } = makeFacade();
      orderService.cancelOrder.mockResolvedValue({ id: 'ord-1', state: 'CANCELLED' });

      await facade.cancelOrder('ord-1', 'customer request');

      expect(orderService.cancelOrder).toHaveBeenCalledWith('ord-1', 'customer request');
    });

    it('cancels without reason when none provided', async () => {
      const { facade, orderService } = makeFacade();
      orderService.cancelOrder.mockResolvedValue({ id: 'ord-1' });

      await facade.cancelOrder('ord-1');

      expect(orderService.cancelOrder).toHaveBeenCalledWith('ord-1', undefined);
    });
  });

  describe('markOrderPending', () => {
    it('delegates to orderService.markOrderPending', async () => {
      const { facade, orderService } = makeFacade();
      orderService.markOrderPending.mockResolvedValue({ id: 'ord-1' });

      await facade.markOrderPending('ord-1');

      expect(orderService.markOrderPending).toHaveBeenCalledWith('ord-1');
    });
  });

  describe('approveOrder', () => {
    it('delegates to orderService.approveOrder', async () => {
      const { facade, orderService } = makeFacade();
      orderService.approveOrder.mockResolvedValue({ id: 'ord-1' });

      await facade.approveOrder('ord-1');

      expect(orderService.approveOrder).toHaveBeenCalledWith('ord-1');
    });
  });

  describe('addLineItem', () => {
    it('delegates to lineItemService.addLineItem with full input', async () => {
      const { facade, lineItemService } = makeFacade();
      const input = { orderId: 'ord-1', variantId: 'var-1', quantity: 2 };
      const lineItem = { id: 'li-1' };
      lineItemService.addLineItem.mockResolvedValue(lineItem);

      const result = await facade.addLineItem(input as any);

      expect(lineItemService.addLineItem).toHaveBeenCalledWith(input);
      expect(result).toBe(lineItem);
    });
  });

  describe('updateLineItemQuantity', () => {
    it('delegates to lineItemService.updateQuantity', async () => {
      const { facade, lineItemService } = makeFacade();
      const input = { orderId: 'ord-1', lineItemId: 'li-1', quantity: 5 };
      lineItemService.updateQuantity.mockResolvedValue({ id: 'li-1', quantity: 5 });

      await facade.updateLineItemQuantity(input as any);

      expect(lineItemService.updateQuantity).toHaveBeenCalledWith(input);
    });
  });

  describe('removeLineItem', () => {
    it('delegates to lineItemService.removeLineItem', async () => {
      const { facade, lineItemService } = makeFacade();
      lineItemService.removeLineItem.mockResolvedValue(undefined);

      await facade.removeLineItem('ord-1', 'li-1');

      expect(lineItemService.removeLineItem).toHaveBeenCalledWith('ord-1', 'li-1');
    });
  });

  describe('getLineItems', () => {
    it('delegates to lineItemService.getLineItems', async () => {
      const { facade, lineItemService } = makeFacade();
      lineItemService.getLineItems.mockResolvedValue([]);

      await facade.getLineItems('ord-1');

      expect(lineItemService.getLineItems).toHaveBeenCalledWith('ord-1');
    });
  });

  describe('assignAddresses', () => {
    it('delegates to orderAddressService.assignAddresses', async () => {
      const { facade, orderAddressService } = makeFacade();
      const input = { orderId: 'ord-1', shipAddressId: 'addr-1', billAddressId: 'addr-2' };
      orderAddressService.assignAddresses.mockResolvedValue({ id: 'ord-1' });

      await facade.assignAddresses(input as any);

      expect(orderAddressService.assignAddresses).toHaveBeenCalledWith(input);
    });
  });

  describe('recalculateTotals', () => {
    it('calls pricingService.recalculate with orderId and stateId', async () => {
      const { facade, pricingService } = makeFacade();
      pricingService.recalculate.mockResolvedValue(undefined);

      await facade.recalculateTotals('ord-1', 'state-42');

      expect(pricingService.recalculate).toHaveBeenCalledWith('ord-1', { stateId: 'state-42' });
    });

    it('passes undefined stateId when not provided', async () => {
      const { facade, pricingService } = makeFacade();
      pricingService.recalculate.mockResolvedValue(undefined);

      await facade.recalculateTotals('ord-1');

      expect(pricingService.recalculate).toHaveBeenCalledWith('ord-1', { stateId: undefined });
    });
  });

  describe('recalculateOrderTotals', () => {
    it('recalculates then fetches the updated order', async () => {
      const { facade, orderService, pricingService } = makeFacade();
      const freshOrder = { id: 'ord-1', total: 200 };
      pricingService.recalculate.mockResolvedValue(undefined);
      orderService.getOrder.mockResolvedValue(freshOrder);

      const result = await facade.recalculateOrderTotals('ord-1');

      expect(pricingService.recalculate).toHaveBeenCalledWith('ord-1');
      expect(orderService.getOrder).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(freshOrder);
    });
  });

  describe('getPaymentContext', () => {
    it('delegates to orderService.getPaymentContext', async () => {
      const { facade, orderService } = makeFacade();
      const ctx = { total: 100, payment_total: 0 };
      orderService.getPaymentContext.mockResolvedValue(ctx);

      const result = await facade.getPaymentContext('ord-1');

      expect(orderService.getPaymentContext).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(ctx);
    });
  });

  describe('getFulfillmentContext', () => {
    it('delegates to orderService.getFulfillmentContext', async () => {
      const { facade, orderService } = makeFacade();
      const ctx = { lineItems: [] };
      orderService.getFulfillmentContext.mockResolvedValue(ctx);

      const result = await facade.getFulfillmentContext('ord-1');

      expect(orderService.getFulfillmentContext).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(ctx);
    });
  });

  describe('boundary: forbidden methods', () => {
    it('does not expose processPayment', () => {
      const { facade } = makeFacade();
      expect((facade as any).processPayment).toBeUndefined();
    });

    it('does not expose createShipment', () => {
      const { facade } = makeFacade();
      expect((facade as any).createShipment).toBeUndefined();
    });

    it('does not expose createFulfillment', () => {
      const { facade } = makeFacade();
      expect((facade as any).createFulfillment).toBeUndefined();
    });

    it('does not expose createPromotion', () => {
      const { facade } = makeFacade();
      expect((facade as any).createPromotion).toBeUndefined();
    });

    it('does not expose evaluateOrderPromotions', () => {
      const { facade } = makeFacade();
      expect((facade as any).evaluateOrderPromotions).toBeUndefined();
    });
  });
});
