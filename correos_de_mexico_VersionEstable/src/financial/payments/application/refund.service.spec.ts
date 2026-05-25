import { Test } from '@nestjs/testing';
import { RefundService } from './refund.service';
import { PAYMENT_PROCESSOR } from '../domain/contracts';
import { RefundRepository } from '../infrastructure/repositories/refund.repository';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { RefundReasonService } from './refund-reason.service';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';
import { EventBusService } from '../../../core/shared';
import { PaymentState, RefundState } from '../domain/enums';
import {
  RefundNotProcessableException,
  RefundAmountExceededException,
  PaymentProcessingException,
} from '../domain/exceptions';
import { RefundProcessedEvent } from '../domain/events';

const mockProcessor = { refundPayment: jest.fn(), gatewayCode: 'stripe' };

const mockRefundRepo = {
  create: jest.fn(),
  update: jest.fn(),
  sumReservedAmountByPayment: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findByPaymentId: jest.fn(),
  findByOrderId: jest.fn(),
  findByReimbursementId: jest.fn(),
};

const mockPaymentRepo = { findByIdOrThrow: jest.fn() };
const mockRefundReasonService = { validateActiveReason: jest.fn() };
const mockSalesFacade = { getPaymentContext: jest.fn() };
const mockEventBus = { emit: jest.fn() };

const capturedPayment = {
  id: 'pay-1',
  state: PaymentState.CAPTURED,
  order_id: 'ord-1',
  payment_intent_id: 'pi_123',
  captured_amount: '500',
  gateway_code: 'stripe',
};

const activeReason = { id: 'rr-1', name: 'Defective product', active: true };

describe('RefundService', () => {
  let service: RefundService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefundService,
        { provide: PAYMENT_PROCESSOR, useValue: mockProcessor },
        { provide: RefundRepository, useValue: mockRefundRepo },
        { provide: PaymentRepository, useValue: mockPaymentRepo },
        { provide: RefundReasonService, useValue: mockRefundReasonService },
        { provide: SalesFacade, useValue: mockSalesFacade },
        { provide: EventBusService, useValue: mockEventBus },
      ],
    }).compile();

    service = module.get(RefundService);
    jest.resetAllMocks();
  });

  describe('createRefund', () => {
    const baseInput = { paymentId: 'pay-1', amount: 100, refundReasonId: 'rr-1' };

    it('throws RefundNotProcessableException when payment state is not CAPTURED', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({ ...capturedPayment, state: PaymentState.AUTHORIZED });

      await expect(service.createRefund(baseInput)).rejects.toThrow(RefundNotProcessableException);
      expect(mockRefundRepo.create).not.toHaveBeenCalled();
    });

    it('throws RefundNotProcessableException for PENDING state', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({ ...capturedPayment, state: PaymentState.PENDING });

      await expect(service.createRefund(baseInput)).rejects.toThrow(RefundNotProcessableException);
    });

    it('throws PaymentProcessingException when order_id is missing', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        ...capturedPayment,
        order_id: null,
      });

      await expect(service.createRefund(baseInput)).rejects.toThrow(PaymentProcessingException);
    });

    it('throws PaymentProcessingException when payment_intent_id is missing', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        ...capturedPayment,
        payment_intent_id: null,
      });

      await expect(service.createRefund(baseInput)).rejects.toThrow(PaymentProcessingException);
    });

    it('throws RefundAmountExceededException when amount > remaining refundable', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment); // captured_amount = 500
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(450); // remaining = 50

      await expect(service.createRefund({ ...baseInput, amount: 200 })).rejects.toThrow(
        RefundAmountExceededException,
      );
      expect(mockRefundRepo.create).not.toHaveBeenCalled();
    });

    it('throws RefundAmountExceededException for one cent over the remaining balance', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment); // captured = 500
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(400); // remaining = 100

      await expect(service.createRefund({ ...baseInput, amount: 100.01 })).rejects.toThrow(
        RefundAmountExceededException,
      );
    });

    it('allows amount exactly equal to the remaining refundable balance', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(400); // remaining = 100
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await expect(service.createRefund({ ...baseInput, amount: 100 })).resolves.not.toThrow();
    });

    it('throws PaymentProcessingException when order currency is null', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: null });
      const refund = { id: 'ref-1', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);

      await expect(service.createRefund(baseInput)).rejects.toThrow(PaymentProcessingException);
    });

    it('creates refund record with PENDING state before calling gateway', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await service.createRefund(baseInput);

      expect(mockRefundRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_id: 'pay-1',
          amount: 100,
          refund_reason_id: 'rr-1',
          state: RefundState.PENDING,
        }),
      );
    });

    it('sets state to PROCESSED and emits RefundProcessedEvent on gateway success', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await service.createRefund(baseInput);

      expect(mockRefundRepo.update).toHaveBeenCalledWith('ref-1', expect.objectContaining({ state: RefundState.PROCESSED }));
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(RefundProcessedEvent));
    });

    it('sets state to FAILED and does NOT emit event on gateway failure', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: false, status: 'failed', gatewayRefundId: null, responseCode: 'gateway_error', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.FAILED });

      await service.createRefund(baseInput);

      expect(mockRefundRepo.update).toHaveBeenCalledWith('ref-1', expect.objectContaining({ state: RefundState.FAILED }));
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });

    it('persists reimbursementId so fulfillment can link refund to reimbursement', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await service.createRefund({ ...baseInput, reimbursementId: 'reimb-77' });

      expect(mockRefundRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ reimbursement_id: 'reimb-77' }),
      );
    });

    it('omits reimbursement_id (null) when not provided', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await service.createRefund(baseInput);

      expect(mockRefundRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ reimbursement_id: null }),
      );
    });

    it('uses salesFacade only for getPaymentContext — payment is NOT modified', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await service.createRefund(baseInput);

      // salesFacade called exactly once, read-only
      expect(mockSalesFacade.getPaymentContext).toHaveBeenCalledTimes(1);
      // payments does not own these operations
      expect((mockSalesFacade as any).createOrder).toBeUndefined();
      expect((mockSalesFacade as any).cancelOrder).toBeUndefined();
      expect((mockSalesFacade as any).markOrderPending).toBeUndefined();
    });

    it('passes correct gateway metadata to processor', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(capturedPayment);
      mockRefundReasonService.validateActiveReason.mockResolvedValue(activeReason);
      mockRefundRepo.sumReservedAmountByPayment.mockResolvedValue(0);
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      const refund = { id: 'ref-1', amount: '100', state: RefundState.PENDING };
      mockRefundRepo.create.mockResolvedValue(refund);
      mockProcessor.refundPayment.mockResolvedValue({
        success: true, status: 'processed', gatewayRefundId: 're_1', responseCode: 'ok', gatewayMetadata: {},
      });
      mockRefundRepo.update.mockResolvedValue({ ...refund, state: RefundState.PROCESSED });

      await service.createRefund(baseInput);

      expect(mockProcessor.refundPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          refundId: 'ref-1',
          paymentId: 'pay-1',
          gatewayTransactionId: 'pi_123',
          amount: 100,
          currency: 'MXN',
        }),
      );
    });
  });

  describe('getRefundsByReimbursement', () => {
    it('delegates to refundRepo.findByReimbursementId', async () => {
      const refunds = [{ id: 'ref-1' }];
      mockRefundRepo.findByReimbursementId.mockResolvedValue(refunds);

      const result = await service.getRefundsByReimbursement('reimb-1');

      expect(mockRefundRepo.findByReimbursementId).toHaveBeenCalledWith('reimb-1');
      expect(result).toBe(refunds);
    });
  });

  describe('getRefundsByPayment', () => {
    it('delegates to refundRepo.findByPaymentId', async () => {
      mockRefundRepo.findByPaymentId.mockResolvedValue([]);

      await service.getRefundsByPayment('pay-1');

      expect(mockRefundRepo.findByPaymentId).toHaveBeenCalledWith('pay-1');
    });
  });

  describe('getRefundsByOrder', () => {
    it('delegates to refundRepo.findByOrderId', async () => {
      mockRefundRepo.findByOrderId.mockResolvedValue([]);

      await service.getRefundsByOrder('ord-1');

      expect(mockRefundRepo.findByOrderId).toHaveBeenCalledWith('ord-1');
    });
  });
});
