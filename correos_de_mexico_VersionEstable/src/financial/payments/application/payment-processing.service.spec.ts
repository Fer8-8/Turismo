import { Test } from '@nestjs/testing';
import { PaymentProcessingService } from './payment-processing.service';
import { PAYMENT_PROCESSOR } from '../domain/contracts';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { EventBusService, PaymentAuthorizedEvent, PaymentCapturedEvent } from '../../../core/shared';
import { PaymentFailedEvent } from '../domain/events';
import { PaymentState } from '../domain/enums';
import {
  PaymentAlreadyCapturedException,
  PaymentNotAuthorizedException,
  PaymentProcessingException,
} from '../domain/exceptions';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';

const mockProcessor = {
  processPayment: jest.fn(),
  capturePayment: jest.fn(),
};

const mockPaymentRepo = {
  findByIdOrThrow: jest.fn(),
  updateState: jest.fn(),
  createCaptureEvent: jest.fn(),
};

const mockEventBus = { emit: jest.fn() };
const mockSalesFacade = { getPaymentContext: jest.fn() };

describe('PaymentProcessingService', () => {
  let service: PaymentProcessingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentProcessingService,
        { provide: PAYMENT_PROCESSOR, useValue: mockProcessor },
        { provide: PaymentRepository, useValue: mockPaymentRepo },
        { provide: EventBusService, useValue: mockEventBus },
        { provide: SalesFacade, useValue: mockSalesFacade },
      ],
    }).compile();

    service = module.get(PaymentProcessingService);
    jest.resetAllMocks();
  });

  describe('processPayment', () => {
    const callArgs = {
      paymentId: 'pay-1',
      orderId: 'ord-1',
      amount: 300,
      currency: 'MXN',
      paymentMethodType: 'card',
    };

    it('sets state to PROCESSING before calling the gateway', async () => {
      const callOrder: string[] = [];

      mockPaymentRepo.updateState.mockImplementation((_id: string, data: any) => {
        callOrder.push(`updateState:${data.state}`);
        return Promise.resolve({ id: 'pay-1', state: data.state });
      });
      mockProcessor.processPayment.mockImplementation(() => {
        callOrder.push('gateway');
        return Promise.resolve({
          success: true,
          status: 'authorized',
          responseCode: 'ok',
          gatewayTransactionId: 'pi_1',
          gatewayMetadata: {},
        });
      });

      await service.processPayment(callArgs.paymentId, callArgs.orderId, callArgs.amount, callArgs.currency, callArgs.paymentMethodType);

      expect(callOrder[0]).toBe(`updateState:${PaymentState.PROCESSING}`);
      expect(callOrder[1]).toBe('gateway');
    });

    it('sets state to AUTHORIZED and emits PaymentAuthorizedEvent on authorized result', async () => {
      mockPaymentRepo.updateState
        .mockResolvedValueOnce({ id: 'pay-1', state: PaymentState.PROCESSING })
        .mockResolvedValue({ id: 'pay-1', state: PaymentState.AUTHORIZED });
      mockProcessor.processPayment.mockResolvedValue({
        success: true,
        status: 'authorized',
        responseCode: 'auth_ok',
        gatewayTransactionId: 'pi_123',
        gatewayMetadata: {},
      });

      await service.processPayment(callArgs.paymentId, callArgs.orderId, callArgs.amount, callArgs.currency, callArgs.paymentMethodType);

      expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
        'pay-1',
        expect.objectContaining({
          state: PaymentState.AUTHORIZED,
          payment_intent_id: 'pi_123',
        }),
      );
      expect(mockPaymentRepo.createCaptureEvent).not.toHaveBeenCalled();
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentAuthorizedEvent));
    });

    it('sets state to CAPTURED, creates capture event, and emits PaymentCapturedEvent', async () => {
      mockPaymentRepo.updateState.mockResolvedValue({ id: 'pay-1', state: PaymentState.CAPTURED });
      mockPaymentRepo.createCaptureEvent.mockResolvedValue(undefined);
      mockProcessor.processPayment.mockResolvedValue({
        success: true,
        status: 'captured',
        responseCode: 'cap_ok',
        gatewayTransactionId: 'pi_123',
        gatewayMetadata: {},
      });

      await service.processPayment(callArgs.paymentId, callArgs.orderId, callArgs.amount, callArgs.currency, callArgs.paymentMethodType);

      expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
        'pay-1',
        expect.objectContaining({
          state: PaymentState.CAPTURED,
          captured_amount: 300,
        }),
      );
      expect(mockPaymentRepo.createCaptureEvent).toHaveBeenCalledWith('pay-1', 300);
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentCapturedEvent));
    });

    it('sets state to FAILED, emits PaymentFailedEvent, and throws PaymentProcessingException on failure', async () => {
      mockPaymentRepo.updateState.mockResolvedValue({ id: 'pay-1', state: PaymentState.FAILED });
      mockProcessor.processPayment.mockResolvedValue({
        success: false,
        status: 'failed',
        responseCode: 'card_declined',
        gatewayTransactionId: null,
        errorMessage: 'Card declined',
      });

      await expect(
        service.processPayment(callArgs.paymentId, callArgs.orderId, callArgs.amount, callArgs.currency, callArgs.paymentMethodType),
      ).rejects.toThrow(PaymentProcessingException);

      expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
        'pay-1',
        expect.objectContaining({ state: PaymentState.FAILED }),
      );
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentFailedEvent));
    });

    it('does NOT emit PaymentAuthorizedEvent when result is captured (not authorized)', async () => {
      mockPaymentRepo.updateState.mockResolvedValue({ id: 'pay-1', state: PaymentState.CAPTURED });
      mockPaymentRepo.createCaptureEvent.mockResolvedValue(undefined);
      mockProcessor.processPayment.mockResolvedValue({
        success: true,
        status: 'captured',
        responseCode: 'ok',
        gatewayTransactionId: 'pi_123',
        gatewayMetadata: {},
      });

      await service.processPayment(callArgs.paymentId, callArgs.orderId, callArgs.amount, callArgs.currency, callArgs.paymentMethodType);

      const emittedEvents = mockEventBus.emit.mock.calls.map((c) => c[0]);
      expect(emittedEvents.some((e) => e instanceof PaymentAuthorizedEvent)).toBe(false);
      expect(emittedEvents.some((e) => e instanceof PaymentCapturedEvent)).toBe(true);
    });
  });

  describe('capturePayment', () => {
    it('throws PaymentAlreadyCapturedException when payment is already CAPTURED', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.CAPTURED,
        payment_intent_id: 'pi_123',
        order_id: 'ord-1',
      });

      await expect(service.capturePayment('pay-1')).rejects.toThrow(PaymentAlreadyCapturedException);
      expect(mockProcessor.capturePayment).not.toHaveBeenCalled();
    });

    it('throws PaymentNotAuthorizedException when payment is PENDING (not capturable)', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.PENDING,
        payment_intent_id: 'pi_123',
        order_id: 'ord-1',
      });

      await expect(service.capturePayment('pay-1')).rejects.toThrow(PaymentNotAuthorizedException);
    });

    it('throws PaymentNotAuthorizedException when payment is FAILED', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.FAILED,
        payment_intent_id: 'pi_123',
        order_id: 'ord-1',
      });

      await expect(service.capturePayment('pay-1')).rejects.toThrow(PaymentNotAuthorizedException);
    });

    it('throws PaymentProcessingException when no payment_intent_id', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.AUTHORIZED,
        payment_intent_id: null,
        order_id: 'ord-1',
      });

      await expect(service.capturePayment('pay-1')).rejects.toThrow(PaymentProcessingException);
    });

    it('throws PaymentProcessingException when order currency is missing', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.AUTHORIZED,
        payment_intent_id: 'pi_123',
        order_id: 'ord-1',
        amount: '300',
      });
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: null });

      await expect(service.capturePayment('pay-1')).rejects.toThrow(PaymentProcessingException);
      expect(mockProcessor.capturePayment).not.toHaveBeenCalled();
    });

    it('captures successfully: creates capture event and emits PaymentCapturedEvent', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.AUTHORIZED,
        payment_intent_id: 'pi_123',
        order_id: 'ord-1',
        amount: '300',
      });
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      mockProcessor.capturePayment.mockResolvedValue({
        success: true,
        capturedAmount: 300,
        responseCode: 'cap_ok',
        gatewayMetadata: {},
      });
      mockPaymentRepo.createCaptureEvent.mockResolvedValue(undefined);
      mockPaymentRepo.updateState.mockResolvedValue({ id: 'pay-1', state: PaymentState.CAPTURED });

      await service.capturePayment('pay-1');

      expect(mockPaymentRepo.createCaptureEvent).toHaveBeenCalledWith('pay-1', 300);
      expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
        'pay-1',
        expect.objectContaining({ state: PaymentState.CAPTURED, captured_amount: 300 }),
      );
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentCapturedEvent));
    });

    it('throws PaymentProcessingException when gateway capture fails', async () => {
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue({
        id: 'pay-1',
        state: PaymentState.AUTHORIZED,
        payment_intent_id: 'pi_123',
        order_id: 'ord-1',
        amount: '300',
      });
      mockSalesFacade.getPaymentContext.mockResolvedValue({ currency: 'MXN' });
      mockProcessor.capturePayment.mockResolvedValue({
        success: false,
        capturedAmount: 0,
        errorMessage: 'Gateway timeout',
        responseCode: null,
      });

      await expect(service.capturePayment('pay-1')).rejects.toThrow(PaymentProcessingException);
      expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });
  });
});
