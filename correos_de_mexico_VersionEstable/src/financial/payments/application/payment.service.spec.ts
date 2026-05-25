import { Test } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { PaymentValidationService } from './payment-validation.service';
import { PaymentProcessingService } from './payment-processing.service';
import { GatewayService } from './gateway.service';
import { EventBusService } from '../../../core/shared';
import { PaymentState, GatewayCode } from '../domain/enums';
import { PaymentCreatedEvent } from '../domain/events';

const mockPaymentRepo = {
  create: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findByOrderId: jest.fn(),
  updateState: jest.fn(),
};

const mockValidationService = {
  validateOrderPayable: jest.fn(),
  validateAmountConsistency: jest.fn(),
  validatePaymentMethod: jest.fn(),
};

const mockProcessingService = {
  processPayment: jest.fn(),
  capturePayment: jest.fn(),
};

const mockGatewayService = {
  getActiveGateway: jest.fn(),
};

const mockEventBus = { emit: jest.fn() };

const baseCtx = {
  total: 500,
  outstandingBalance: 500,
  payable: true,
  storeId: 's-1',
  currency: 'MXN',
  state: 'PENDING',
};

const baseMethod = { id: 'pm-1', type: 'card', active: true, auto_capture: false };
const baseGateway = { code: GatewayCode.STRIPE, active: true, label: 'Stripe' };

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PaymentRepository, useValue: mockPaymentRepo },
        { provide: PaymentValidationService, useValue: mockValidationService },
        { provide: PaymentProcessingService, useValue: mockProcessingService },
        { provide: GatewayService, useValue: mockGatewayService },
        { provide: EventBusService, useValue: mockEventBus },
      ],
    }).compile();

    service = module.get(PaymentService);
    jest.resetAllMocks();
  });

  describe('createPayment', () => {
    const input = { orderId: 'ord-1', paymentMethodId: 'pm-1', amount: 300 };

    beforeEach(() => {
      mockValidationService.validateOrderPayable.mockResolvedValue(baseCtx);
      mockValidationService.validateAmountConsistency.mockResolvedValue(baseCtx);
      mockValidationService.validatePaymentMethod.mockResolvedValue(baseMethod);
      mockGatewayService.getActiveGateway.mockReturnValue(baseGateway);
    });

    it('runs all three validations in order before creating the payment record', async () => {
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockPaymentRepo.updateState.mockResolvedValue({ ...pay, state: PaymentState.PENDING });

      await service.createPayment(input);

      expect(mockValidationService.validateOrderPayable).toHaveBeenCalledWith('ord-1');
      expect(mockValidationService.validateAmountConsistency).toHaveBeenCalledWith('ord-1', 300);
      expect(mockValidationService.validatePaymentMethod).toHaveBeenCalledWith('pm-1', 's-1');
    });

    it('creates payment record with CHECKOUT state, correct amount and gateway code', async () => {
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockPaymentRepo.updateState.mockResolvedValue({ ...pay, state: PaymentState.PENDING });

      await service.createPayment(input);

      expect(mockPaymentRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 300,
          order_id: 'ord-1',
          payment_method_id: 'pm-1',
          state: PaymentState.CHECKOUT,
          gateway_code: GatewayCode.STRIPE,
        }),
      );
    });

    it('payment number follows PAY-XXXXXXXX format', async () => {
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockPaymentRepo.updateState.mockResolvedValue({ ...pay, state: PaymentState.PENDING });

      await service.createPayment(input);

      const createArg = mockPaymentRepo.create.mock.calls[0][0];
      expect(createArg.number).toMatch(/^PAY-[A-Z0-9]{8}$/);
    });

    it('emits PaymentCreatedEvent with correct payload', async () => {
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockPaymentRepo.updateState.mockResolvedValue({ ...pay, state: PaymentState.PENDING });

      await service.createPayment(input);

      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentCreatedEvent));
      const event = mockEventBus.emit.mock.calls[0][0] as PaymentCreatedEvent;
      expect(event.paymentId).toBe('pay-1');
      expect(event.orderId).toBe('ord-1');
      expect(event.amount).toBe(300);
      expect(event.storeId).toBe('s-1');
    });

    it('moves to PENDING and does NOT call processingService when auto_capture is false', async () => {
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockPaymentRepo.updateState.mockResolvedValue({ ...pay, state: PaymentState.PENDING });

      await service.createPayment(input);

      expect(mockPaymentRepo.updateState).toHaveBeenCalledWith('pay-1', { state: PaymentState.PENDING });
      expect(mockProcessingService.processPayment).not.toHaveBeenCalled();
    });

    it('delegates to processingService immediately when auto_capture is true', async () => {
      mockValidationService.validatePaymentMethod.mockResolvedValue({
        ...baseMethod,
        auto_capture: true,
        type: 'card',
      });
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockProcessingService.processPayment.mockResolvedValue({ id: 'pay-1', state: PaymentState.CAPTURED });

      await service.createPayment(input);

      expect(mockProcessingService.processPayment).toHaveBeenCalledWith(
        'pay-1',
        'ord-1',
        300,
        'MXN',
        'card',
      );
      expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
    });

    it('does NOT create the payment record if validateOrderPayable fails', async () => {
      mockValidationService.validateOrderPayable.mockRejectedValue(new Error('Not payable'));

      await expect(service.createPayment(input)).rejects.toThrow('Not payable');

      expect(mockPaymentRepo.create).not.toHaveBeenCalled();
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });

    it('does NOT create the payment record if validateAmountConsistency fails', async () => {
      mockValidationService.validateAmountConsistency.mockRejectedValue(new Error('Amount mismatch'));

      await expect(service.createPayment(input)).rejects.toThrow('Amount mismatch');

      expect(mockPaymentRepo.create).not.toHaveBeenCalled();
    });

    it('uses MXN as default currency when ctx.currency is null', async () => {
      mockValidationService.validateOrderPayable.mockResolvedValue({ ...baseCtx, currency: null });
      mockValidationService.validatePaymentMethod.mockResolvedValue({ ...baseMethod, auto_capture: true });
      const pay = { id: 'pay-1' };
      mockPaymentRepo.create.mockResolvedValue(pay);
      mockProcessingService.processPayment.mockResolvedValue({ id: 'pay-1' });

      await service.createPayment(input);

      expect(mockProcessingService.processPayment).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Number),
        'MXN',
        expect.any(String),
      );
    });
  });

  describe('getPayment', () => {
    it('delegates to paymentRepo.findByIdOrThrow', async () => {
      const pay = { id: 'pay-1', state: PaymentState.CAPTURED };
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(pay);

      const result = await service.getPayment('pay-1');

      expect(mockPaymentRepo.findByIdOrThrow).toHaveBeenCalledWith('pay-1');
      expect(result).toBe(pay);
    });
  });

  describe('getPaymentsByOrder', () => {
    it('delegates to paymentRepo.findByOrderId', async () => {
      mockPaymentRepo.findByOrderId.mockResolvedValue([]);

      await service.getPaymentsByOrder('ord-1');

      expect(mockPaymentRepo.findByOrderId).toHaveBeenCalledWith('ord-1');
    });
  });

  describe('processPayment', () => {
    it('returns existing payment early when it already has a payment_intent_id and is in AUTHORIZED state', async () => {
      const pay = {
        id: 'pay-1',
        payment_intent_id: 'pi_existing',
        state: PaymentState.AUTHORIZED,
        order_id: 'ord-1',
      };
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(pay);

      const result = await service.processPayment('pay-1');

      expect(result).toBe(pay);
      expect(mockProcessingService.processPayment).not.toHaveBeenCalled();
      expect(mockValidationService.validateOrderPayable).not.toHaveBeenCalled();
    });

    it('returns early for CAPTURED state (already completed)', async () => {
      const pay = { id: 'pay-1', payment_intent_id: 'pi_existing', state: PaymentState.CAPTURED, order_id: 'ord-1' };
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(pay);

      const result = await service.processPayment('pay-1');

      expect(result).toBe(pay);
      expect(mockProcessingService.processPayment).not.toHaveBeenCalled();
    });

    it('calls processingService when payment has no payment_intent_id', async () => {
      const pay = {
        id: 'pay-1',
        payment_intent_id: null,
        state: PaymentState.PENDING,
        order_id: 'ord-1',
        amount: 300,
        paymentMethod: { type: 'card' },
      };
      mockPaymentRepo.findByIdOrThrow.mockResolvedValue(pay);
      mockValidationService.validateOrderPayable.mockResolvedValue(baseCtx);
      mockProcessingService.processPayment.mockResolvedValue({ id: 'pay-1', state: PaymentState.CAPTURED });

      await service.processPayment('pay-1');

      expect(mockProcessingService.processPayment).toHaveBeenCalledWith(
        'pay-1',
        'ord-1',
        300,
        'MXN',
        'card',
      );
    });
  });

  describe('capturePayment', () => {
    it('delegates to processingService.capturePayment', async () => {
      mockProcessingService.capturePayment.mockResolvedValue({ id: 'pay-1', state: PaymentState.CAPTURED });

      await service.capturePayment('pay-1');

      expect(mockProcessingService.capturePayment).toHaveBeenCalledWith('pay-1');
    });
  });
});
