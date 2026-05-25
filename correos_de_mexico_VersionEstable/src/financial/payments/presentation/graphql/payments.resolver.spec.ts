import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsFacade } from '../../facades/payments.facade';

const mockPaymentsFacade = {
  // payments
  createPayment: jest.fn(),
  processPayment: jest.fn(),
  capturePayment: jest.fn(),
  getPayment: jest.fn(),
  getPaymentsByOrder: jest.fn(),
  getOrderPaymentSummary: jest.fn(),
  // refunds
  createRefund: jest.fn(),
  getRefund: jest.fn(),
  getRefundsByPayment: jest.fn(),
  getRefundsByOrder: jest.fn(),
  // payment methods
  createPaymentMethod: jest.fn(),
  getPaymentMethod: jest.fn(),
  listPaymentMethods: jest.fn(),
  updatePaymentMethod: jest.fn(),
  activatePaymentMethod: jest.fn(),
  deactivatePaymentMethod: jest.fn(),
  listMethodsForStore: jest.fn(),
  associateMethodToStore: jest.fn(),
  disassociateMethodFromStore: jest.fn(),
  isMethodAvailableForStore: jest.fn(),
  // gateways
  listGateways: jest.fn(),
  // refund reasons
  createRefundReason: jest.fn(),
  getRefundReason: jest.fn(),
  listRefundReasons: jest.fn(),
  updateRefundReason: jest.fn(),
  activateRefundReason: jest.fn(),
  deactivateRefundReason: jest.fn(),
};

describe('PaymentsResolver', () => {
  let resolver: PaymentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsResolver,
        { provide: PaymentsFacade, useValue: mockPaymentsFacade },
      ],
    }).compile();

    resolver = module.get(PaymentsResolver);
    jest.clearAllMocks();
  });

  // ─── Payment mutations ────────────────────────────────────────────────────────

  describe('createPayment', () => {
    it('extracts orderId, paymentMethodId and amount from input and delegates to facade', async () => {
      const pay = { id: 'pay-1', state: 'PENDING' };
      mockPaymentsFacade.createPayment.mockResolvedValue(pay);
      const input = { orderId: 'ord-1', paymentMethodId: 'pm-1', amount: 500 } as any;

      const result = await resolver.createPayment(input);

      expect(mockPaymentsFacade.createPayment).toHaveBeenCalledWith({
        orderId: 'ord-1',
        paymentMethodId: 'pm-1',
        amount: 500,
      });
      expect(result).toBe(pay);
    });
  });

  describe('processPayment', () => {
    it('passes input.paymentId to facade.processPayment', async () => {
      mockPaymentsFacade.processPayment.mockResolvedValue({ id: 'pay-1' });

      await resolver.processPayment({ paymentId: 'pay-1' } as any);

      expect(mockPaymentsFacade.processPayment).toHaveBeenCalledWith('pay-1');
    });
  });

  describe('capturePayment', () => {
    it('passes input.paymentId to facade.capturePayment', async () => {
      mockPaymentsFacade.capturePayment.mockResolvedValue({ id: 'pay-1' });

      await resolver.capturePayment({ paymentId: 'pay-1' } as any);

      expect(mockPaymentsFacade.capturePayment).toHaveBeenCalledWith('pay-1');
    });
  });

  describe('createRefund', () => {
    it('passes the full input object to facade.createRefund', async () => {
      const refund = { id: 'ref-1' };
      mockPaymentsFacade.createRefund.mockResolvedValue(refund);
      const input = {
        paymentId: 'pay-1',
        amount: 100,
        refundReasonId: 'rr-1',
        reimbursementId: 'reimb-1',
      } as any;

      const result = await resolver.createRefund(input);

      expect(mockPaymentsFacade.createRefund).toHaveBeenCalledWith(input);
      expect(result).toBe(refund);
    });
  });

  // ─── Payment queries ─────────────────────────────────────────────────────────

  describe('getOrderPaymentSummary', () => {
    it('passes input.orderId to facade.getOrderPaymentSummary', async () => {
      const summary = { orderId: 'ord-1', totalPaid: 300, outstandingBalance: 200, payments: [] };
      mockPaymentsFacade.getOrderPaymentSummary.mockResolvedValue(summary);

      const result = await resolver.getOrderPaymentSummary({ orderId: 'ord-1' } as any);

      expect(mockPaymentsFacade.getOrderPaymentSummary).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(summary);
    });
  });

  describe('getPayment', () => {
    it('delegates id directly to facade.getPayment', async () => {
      const pay = { id: 'pay-1' };
      mockPaymentsFacade.getPayment.mockResolvedValue(pay);

      const result = await resolver.getPayment('pay-1');

      expect(mockPaymentsFacade.getPayment).toHaveBeenCalledWith('pay-1');
      expect(result).toBe(pay);
    });
  });

  // ─── Payment method mutations ─────────────────────────────────────────────────

  describe('activatePaymentMethod', () => {
    it('delegates id to facade.activatePaymentMethod', async () => {
      const method = { id: 'pm-1', active: true };
      mockPaymentsFacade.activatePaymentMethod.mockResolvedValue(method);

      const result = await resolver.activatePaymentMethod('pm-1');

      expect(mockPaymentsFacade.activatePaymentMethod).toHaveBeenCalledWith('pm-1');
      expect(result).toBe(method);
    });
  });

  describe('deactivatePaymentMethod', () => {
    it('delegates id to facade.deactivatePaymentMethod', async () => {
      const method = { id: 'pm-1', active: false };
      mockPaymentsFacade.deactivatePaymentMethod.mockResolvedValue(method);

      const result = await resolver.deactivatePaymentMethod('pm-1');

      expect(mockPaymentsFacade.deactivatePaymentMethod).toHaveBeenCalledWith('pm-1');
      expect(result).toBe(method);
    });
  });

  describe('updatePaymentMethod', () => {
    it('separates id from the rest of the input before calling facade.updatePaymentMethod', async () => {
      const method = { id: 'pm-1', name: 'Tarjeta actualizada' };
      mockPaymentsFacade.updatePaymentMethod.mockResolvedValue(method);

      await resolver.updatePaymentMethod({ id: 'pm-1', name: 'Tarjeta actualizada' } as any);

      expect(mockPaymentsFacade.updatePaymentMethod).toHaveBeenCalledWith('pm-1', {
        name: 'Tarjeta actualizada',
      });
      expect(mockPaymentsFacade.updatePaymentMethod.mock.calls[0][0]).toBe('pm-1');
    });
  });

  describe('updateRefundReason', () => {
    it('separates id from data before calling facade.updateRefundReason', async () => {
      mockPaymentsFacade.updateRefundReason.mockResolvedValue({ id: 'rr-1', name: 'Updated' });

      await resolver.updateRefundReason({ id: 'rr-1', name: 'Updated' } as any);

      expect(mockPaymentsFacade.updateRefundReason).toHaveBeenCalledWith('rr-1', { name: 'Updated' });
    });
  });

  // ─── Store association mutations ──────────────────────────────────────────────

  describe('associatePaymentMethodToStore', () => {
    it('calls facade.associateMethodToStore with both ids and returns true', async () => {
      mockPaymentsFacade.associateMethodToStore.mockResolvedValue(undefined);
      const input = { paymentMethodId: 'pm-1', storeId: 's-1' } as any;

      const result = await resolver.associatePaymentMethodToStore(input);

      expect(mockPaymentsFacade.associateMethodToStore).toHaveBeenCalledWith('pm-1', 's-1');
      expect(result).toBe(true);
    });
  });

  describe('disassociatePaymentMethodFromStore', () => {
    it('calls facade.disassociateMethodFromStore with both ids and returns true', async () => {
      mockPaymentsFacade.disassociateMethodFromStore.mockResolvedValue(undefined);
      const input = { paymentMethodId: 'pm-1', storeId: 's-1' } as any;

      const result = await resolver.disassociatePaymentMethodFromStore(input);

      expect(mockPaymentsFacade.disassociateMethodFromStore).toHaveBeenCalledWith('pm-1', 's-1');
      expect(result).toBe(true);
    });
  });

  // ─── Refund reason mutations ──────────────────────────────────────────────────

  describe('activateRefundReason', () => {
    it('delegates id to facade.activateRefundReason', async () => {
      mockPaymentsFacade.activateRefundReason.mockResolvedValue({ id: 'rr-1', active: true });

      await resolver.activateRefundReason('rr-1');

      expect(mockPaymentsFacade.activateRefundReason).toHaveBeenCalledWith('rr-1');
    });
  });

  describe('deactivateRefundReason', () => {
    it('delegates id to facade.deactivateRefundReason', async () => {
      mockPaymentsFacade.deactivateRefundReason.mockResolvedValue({ id: 'rr-1', active: false });

      await resolver.deactivateRefundReason('rr-1');

      expect(mockPaymentsFacade.deactivateRefundReason).toHaveBeenCalledWith('rr-1');
    });
  });
});
