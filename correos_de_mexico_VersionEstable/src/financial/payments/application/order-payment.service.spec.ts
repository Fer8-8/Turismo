import { Test } from '@nestjs/testing';
import { OrderPaymentService } from './order-payment.service';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';

const mockSalesFacade = { getPaymentContext: jest.fn() };
const mockPaymentRepo = {
  findByOrderId: jest.fn(),
  sumPaymentsByOrder: jest.fn(),
};

describe('OrderPaymentService', () => {
  let service: OrderPaymentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderPaymentService,
        { provide: SalesFacade, useValue: mockSalesFacade },
        { provide: PaymentRepository, useValue: mockPaymentRepo },
      ],
    }).compile();

    service = module.get(OrderPaymentService);
    jest.resetAllMocks();
  });

  describe('getOrderPaymentSummary', () => {
    it('computes outstandingBalance as total - totalPaid', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 500 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([
        { id: 'pay-1', amount: 300, state: 'captured', created_at: new Date() },
      ]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(300);

      const summary = await service.getOrderPaymentSummary('ord-1');

      expect(summary.totalPaid).toBe(300);
      expect(summary.outstandingBalance).toBe(200);
    });

    it('outstandingBalance is clamped to 0 when totalPaid exceeds total (over-payment guard)', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 100 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(150);

      const summary = await service.getOrderPaymentSummary('ord-1');

      expect(summary.outstandingBalance).toBe(0);
    });

    it('outstandingBalance is exactly 0 when fully paid', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 300 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(300);

      const summary = await service.getOrderPaymentSummary('ord-1');

      expect(summary.outstandingBalance).toBe(0);
    });

    it('formats payment items with correct shape', async () => {
      const createdAt = new Date('2026-04-01T10:00:00Z');
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 500 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([
        { id: 'pay-1', amount: 300, state: 'captured', created_at: createdAt },
        { id: 'pay-2', amount: 100, state: 'pending', created_at: createdAt },
      ]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(400);

      const summary = await service.getOrderPaymentSummary('ord-1');

      expect(summary.payments).toHaveLength(2);
      expect(summary.payments[0]).toEqual({
        id: 'pay-1',
        amount: 300,
        state: 'captured',
        createdAt,
      });
    });

    it('returns orderId in the summary', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 100 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(0);

      const summary = await service.getOrderPaymentSummary('ord-42');

      expect(summary.orderId).toBe('ord-42');
    });

    it('does NOT call order-modifying operations on salesFacade', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 0 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(0);

      await service.getOrderPaymentSummary('ord-1');

      // salesFacade should only be used with getPaymentContext (read-only)
      expect(mockSalesFacade.getPaymentContext).toHaveBeenCalledTimes(1);
      expect((mockSalesFacade as any).createOrder).toBeUndefined();
      expect((mockSalesFacade as any).markOrderPending).toBeUndefined();
      expect((mockSalesFacade as any).cancelOrder).toBeUndefined();
    });

    it('rounds outstandingBalance to 2 decimal places', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ total: 100.009 });
      mockPaymentRepo.findByOrderId.mockResolvedValue([]);
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(0);

      const summary = await service.getOrderPaymentSummary('ord-1');

      // Should be rounded — not a long floating-point string
      expect(Number(summary.outstandingBalance.toFixed(2))).toBe(summary.outstandingBalance);
    });
  });

  describe('getTotalPaidForOrder', () => {
    it('delegates to paymentRepo.sumPaymentsByOrder', async () => {
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(450);

      const result = await service.getTotalPaidForOrder('ord-1');

      expect(result).toBe(450);
      expect(mockPaymentRepo.sumPaymentsByOrder).toHaveBeenCalledWith('ord-1');
    });

    it('returns 0 when no payments captured', async () => {
      mockPaymentRepo.sumPaymentsByOrder.mockResolvedValue(0);

      const result = await service.getTotalPaidForOrder('ord-1');

      expect(result).toBe(0);
    });
  });
});
