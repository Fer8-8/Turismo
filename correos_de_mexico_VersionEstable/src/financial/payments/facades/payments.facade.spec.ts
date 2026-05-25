import { PaymentsFacade } from './payments.facade';

// ─── Mock factories ───────────────────────────────────────────────────────────

const makePaymentService = () => ({
  createPayment: jest.fn(),
  processPayment: jest.fn(),
  capturePayment: jest.fn(),
  getPayment: jest.fn(),
  getPaymentsByOrder: jest.fn(),
});

const makePaymentMethodService = () => ({
  createPaymentMethod: jest.fn(),
  getPaymentMethod: jest.fn(),
  listPaymentMethods: jest.fn(),
  updatePaymentMethod: jest.fn(),
  activatePaymentMethod: jest.fn(),
  deactivatePaymentMethod: jest.fn(),
  listMethodsForStore: jest.fn(),
  associateToStore: jest.fn(),
  disassociateFromStore: jest.fn(),
  isMethodAvailableForStore: jest.fn(),
});

const makeGatewayService = () => ({
  listGateways: jest.fn(),
  isGatewayActive: jest.fn(),
  getActiveGateway: jest.fn(),
  getGatewayConfig: jest.fn(),
});

const makeOrderPaymentService = () => ({
  getOrderPaymentSummary: jest.fn(),
  getTotalPaidForOrder: jest.fn(),
});

const makeRefundService = () => ({
  createRefund: jest.fn(),
  getRefund: jest.fn(),
  getRefundsByPayment: jest.fn(),
  getRefundsByOrder: jest.fn(),
  getRefundsByReimbursement: jest.fn(),
});

const makeRefundReasonService = () => ({
  createRefundReason: jest.fn(),
  getRefundReason: jest.fn(),
  listRefundReasons: jest.fn(),
  updateRefundReason: jest.fn(),
  activateRefundReason: jest.fn(),
  deactivateRefundReason: jest.fn(),
});

const makeFacade = () => {
  const paymentService = makePaymentService();
  const paymentMethodService = makePaymentMethodService();
  const gatewayService = makeGatewayService();
  const orderPaymentService = makeOrderPaymentService();
  const refundService = makeRefundService();
  const refundReasonService = makeRefundReasonService();

  const facade = new PaymentsFacade(
    paymentService as any,
    paymentMethodService as any,
    gatewayService as any,
    orderPaymentService as any,
    refundService as any,
    refundReasonService as any,
  );

  return {
    facade,
    paymentService,
    paymentMethodService,
    gatewayService,
    orderPaymentService,
    refundService,
    refundReasonService,
  };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PaymentsFacade — payment lifecycle delegation', () => {
  it('createPayment delegates to paymentService.createPayment with the full input object', async () => {
    const { facade, paymentService } = makeFacade();
    const payment = { id: 'pay-1', state: 'PENDING' };
    paymentService.createPayment.mockResolvedValue(payment);
    const input = { orderId: 'ord-1', paymentMethodId: 'pm-1', amount: 300 };

    const result = await facade.createPayment(input as any);

    expect(paymentService.createPayment).toHaveBeenCalledWith(input);
    expect(result).toBe(payment);
  });

  it('processPayment delegates paymentId to paymentService.processPayment', async () => {
    const { facade, paymentService } = makeFacade();
    paymentService.processPayment.mockResolvedValue({ id: 'pay-1' });

    await facade.processPayment('pay-1');

    expect(paymentService.processPayment).toHaveBeenCalledWith('pay-1');
  });

  it('capturePayment delegates paymentId to paymentService.capturePayment', async () => {
    const { facade, paymentService } = makeFacade();
    paymentService.capturePayment.mockResolvedValue({ id: 'pay-1' });

    await facade.capturePayment('pay-1');

    expect(paymentService.capturePayment).toHaveBeenCalledWith('pay-1');
  });

  it('getPayment delegates to paymentService.getPayment', async () => {
    const { facade, paymentService } = makeFacade();
    const pay = { id: 'pay-1' };
    paymentService.getPayment.mockResolvedValue(pay);

    expect(await facade.getPayment('pay-1')).toBe(pay);
    expect(paymentService.getPayment).toHaveBeenCalledWith('pay-1');
  });

  it('getPaymentsByOrder delegates to paymentService.getPaymentsByOrder', async () => {
    const { facade, paymentService } = makeFacade();
    paymentService.getPaymentsByOrder.mockResolvedValue([]);

    await facade.getPaymentsByOrder('ord-1');

    expect(paymentService.getPaymentsByOrder).toHaveBeenCalledWith('ord-1');
  });
});

describe('PaymentsFacade — refund delegation', () => {
  it('createRefund delegates the full input to refundService.createRefund', async () => {
    const { facade, refundService } = makeFacade();
    const refund = { id: 'ref-1' };
    refundService.createRefund.mockResolvedValue(refund);
    const input = { paymentId: 'pay-1', amount: 150, refundReasonId: 'rr-1' };

    const result = await facade.createRefund(input as any);

    expect(refundService.createRefund).toHaveBeenCalledWith(input);
    expect(result).toBe(refund);
  });

  it('getRefundsByReimbursement delegates to refundService.getRefundsByReimbursement', async () => {
    const { facade, refundService } = makeFacade();
    refundService.getRefundsByReimbursement.mockResolvedValue([]);

    await facade.getRefundsByReimbursement('reimb-1');

    expect(refundService.getRefundsByReimbursement).toHaveBeenCalledWith('reimb-1');
  });

  it('getRefundsByPayment delegates to refundService.getRefundsByPayment', async () => {
    const { facade, refundService } = makeFacade();
    refundService.getRefundsByPayment.mockResolvedValue([]);

    await facade.getRefundsByPayment('pay-1');

    expect(refundService.getRefundsByPayment).toHaveBeenCalledWith('pay-1');
  });

  it('getRefundsByOrder delegates to refundService.getRefundsByOrder', async () => {
    const { facade, refundService } = makeFacade();
    refundService.getRefundsByOrder.mockResolvedValue([]);

    await facade.getRefundsByOrder('ord-1');

    expect(refundService.getRefundsByOrder).toHaveBeenCalledWith('ord-1');
  });
});

describe('PaymentsFacade — order payment integration', () => {
  it('getOrderPaymentSummary delegates orderId to orderPaymentService', async () => {
    const { facade, orderPaymentService } = makeFacade();
    const summary = { orderId: 'ord-1', totalPaid: 300, outstandingBalance: 200, payments: [] };
    orderPaymentService.getOrderPaymentSummary.mockResolvedValue(summary);

    const result = await facade.getOrderPaymentSummary('ord-1');

    expect(orderPaymentService.getOrderPaymentSummary).toHaveBeenCalledWith('ord-1');
    expect(result).toBe(summary);
  });

  it('getTotalPaidForOrder delegates orderId to orderPaymentService', async () => {
    const { facade, orderPaymentService } = makeFacade();
    orderPaymentService.getTotalPaidForOrder.mockResolvedValue(450);

    const result = await facade.getTotalPaidForOrder('ord-1');

    expect(result).toBe(450);
    expect(orderPaymentService.getTotalPaidForOrder).toHaveBeenCalledWith('ord-1');
  });
});

describe('PaymentsFacade — payment method delegation', () => {
  it('listMethodsForStore delegates storeId to paymentMethodService.listMethodsForStore', async () => {
    const { facade, paymentMethodService } = makeFacade();
    paymentMethodService.listMethodsForStore.mockResolvedValue([]);

    await facade.listMethodsForStore('store-1');

    expect(paymentMethodService.listMethodsForStore).toHaveBeenCalledWith('store-1');
  });

  it('isMethodAvailableForStore delegates both ids to paymentMethodService', async () => {
    const { facade, paymentMethodService } = makeFacade();
    paymentMethodService.isMethodAvailableForStore.mockResolvedValue(true);

    const result = await facade.isMethodAvailableForStore('pm-1', 'store-1');

    expect(result).toBe(true);
    expect(paymentMethodService.isMethodAvailableForStore).toHaveBeenCalledWith('pm-1', 'store-1');
  });

  it('associateMethodToStore delegates methodId and storeId', async () => {
    const { facade, paymentMethodService } = makeFacade();
    paymentMethodService.associateToStore.mockResolvedValue(undefined);

    await facade.associateMethodToStore('pm-1', 'store-1');

    expect(paymentMethodService.associateToStore).toHaveBeenCalledWith('pm-1', 'store-1');
  });

  it('disassociateMethodFromStore delegates methodId and storeId', async () => {
    const { facade, paymentMethodService } = makeFacade();
    paymentMethodService.disassociateFromStore.mockResolvedValue(undefined);

    await facade.disassociateMethodFromStore('pm-1', 'store-1');

    expect(paymentMethodService.disassociateFromStore).toHaveBeenCalledWith('pm-1', 'store-1');
  });

  it('activatePaymentMethod delegates id to paymentMethodService', async () => {
    const { facade, paymentMethodService } = makeFacade();
    paymentMethodService.activatePaymentMethod.mockResolvedValue({ id: 'pm-1', active: true });

    await facade.activatePaymentMethod('pm-1');

    expect(paymentMethodService.activatePaymentMethod).toHaveBeenCalledWith('pm-1');
  });

  it('deactivatePaymentMethod delegates id to paymentMethodService', async () => {
    const { facade, paymentMethodService } = makeFacade();
    paymentMethodService.deactivatePaymentMethod.mockResolvedValue({ id: 'pm-1', active: false });

    await facade.deactivatePaymentMethod('pm-1');

    expect(paymentMethodService.deactivatePaymentMethod).toHaveBeenCalledWith('pm-1');
  });
});

describe('PaymentsFacade — refund reason delegation', () => {
  it('createRefundReason delegates to refundReasonService', async () => {
    const { facade, refundReasonService } = makeFacade();
    refundReasonService.createRefundReason.mockResolvedValue({ id: 'rr-1' });

    await facade.createRefundReason({ name: 'Defective product' } as any);

    expect(refundReasonService.createRefundReason).toHaveBeenCalledWith({ name: 'Defective product' });
  });

  it('activateRefundReason delegates id to refundReasonService', async () => {
    const { facade, refundReasonService } = makeFacade();
    refundReasonService.activateRefundReason.mockResolvedValue({ id: 'rr-1', active: true });

    await facade.activateRefundReason('rr-1');

    expect(refundReasonService.activateRefundReason).toHaveBeenCalledWith('rr-1');
  });
});

describe('PaymentsFacade — boundary: no cross-domain methods exposed', () => {
  it('does not expose createOrder (sales domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).createOrder).toBeUndefined();
  });

  it('does not expose cancelOrder (sales domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).cancelOrder).toBeUndefined();
  });

  it('does not expose approveOrder (sales domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).approveOrder).toBeUndefined();
  });

  it('does not expose calculatePromotion (marketing domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).calculatePromotion).toBeUndefined();
  });

  it('does not expose applyPromotion (marketing domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).applyPromotion).toBeUndefined();
  });

  it('does not expose reserveInventory (inventory domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).reserveInventory).toBeUndefined();
  });

  it('does not expose createFulfillment (fulfillment domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).createFulfillment).toBeUndefined();
  });

  it('does not expose createShipment (fulfillment domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).createShipment).toBeUndefined();
  });

  it('does not expose createReimbursement (fulfillment domain)', () => {
    const { facade } = makeFacade();
    expect((facade as any).createReimbursement).toBeUndefined();
  });
});
