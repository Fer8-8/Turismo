// PaymentWebhookEventRepository imports Prisma namespace types which use the
// '#prisma/client' Node.js package-imports syntax — not resolvable in Jest
// without a custom resolver. We stub the module before any import resolves it.
jest.mock('../infrastructure/repositories/payment-webhook-event.repository', () => ({
  PaymentWebhookEventRepository: class PaymentWebhookEventRepository {},
}));

import { Test } from '@nestjs/testing';
import { PaymentWebhookService } from './payment-webhook.service';
import { PAYMENT_PROCESSOR } from '../domain/contracts';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { PaymentWebhookEventRepository } from '../infrastructure/repositories/payment-webhook-event.repository';
import { EventBusService, PaymentAuthorizedEvent, PaymentCapturedEvent } from '../../../core/shared';
import { PaymentFailedEvent } from '../domain/events';
import { PaymentState } from '../domain/enums';
import {
  PaymentNotFoundException,
  PaymentProcessingException,
  InvalidPaymentStateTransitionException,
} from '../domain/exceptions';

const mockProcessor = {
  parseWebhookEvent: jest.fn(),
  gatewayCode: 'stripe',
};

const mockPaymentRepo = {
  findByPaymentIntentId: jest.fn(),
  findById: jest.fn(),
  updateState: jest.fn(),
  createCaptureEvent: jest.fn(),
};

const mockWebhookRepo = {
  createOrGet: jest.fn(),
  markProcessed: jest.fn(),
  markIgnored: jest.fn(),
  markFailed: jest.fn(),
};

const mockEventBus = { emit: jest.fn() };

const pendingDelivery = { id: 'wh-1', status: 'PENDING' };

const processingPayment = {
  id: 'pay-1',
  state: PaymentState.PROCESSING,
  order_id: 'ord-1',
  amount: '300',
  gateway_metadata: null,
};

const parsedBase = {
  eventId: 'evt_abc123',
  paymentIntentId: 'pi_123',
  paymentIdHint: null,
  responseCode: null,
  gatewayMetadata: {},
};

describe('PaymentWebhookService', () => {
  let service: PaymentWebhookService;

  beforeEach(async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';

    const module = await Test.createTestingModule({
      providers: [
        PaymentWebhookService,
        { provide: PAYMENT_PROCESSOR, useValue: mockProcessor },
        { provide: PaymentRepository, useValue: mockPaymentRepo },
        { provide: PaymentWebhookEventRepository, useValue: mockWebhookRepo },
        { provide: EventBusService, useValue: mockEventBus },
      ],
    }).compile();

    service = module.get(PaymentWebhookService);
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('throws PaymentProcessingException when STRIPE_WEBHOOK_SECRET is not configured', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    await expect(service.handleStripeWebhook(Buffer.from('{}'), 'sig')).rejects.toThrow(
      PaymentProcessingException,
    );
  });

  it('returns duplicate=true and status=processed for already PROCESSED delivery', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_authorized' });
    mockWebhookRepo.createOrGet.mockResolvedValue({ id: 'wh-1', status: 'PROCESSED' });

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(result.duplicate).toBe(true);
    expect(result.status).toBe('processed');
    expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
  });

  it('returns duplicate=true and status=ignored for already IGNORED delivery', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'ignored' });
    mockWebhookRepo.createOrGet.mockResolvedValue({ id: 'wh-1', status: 'IGNORED' });

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(result.duplicate).toBe(true);
    expect(result.status).toBe('ignored');
  });

  it('marks delivery ignored and returns ignored for events of type "ignored"', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'ignored' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockWebhookRepo.markIgnored.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(result.status).toBe('ignored');
    expect(result.duplicate).toBe(false);
    expect(mockWebhookRepo.markIgnored).toHaveBeenCalledWith(
      'wh-1',
      expect.any(String),
      undefined,
      'pi_123',
    );
  });

  it('throws PaymentNotFoundException and marks delivery failed when payment cannot be resolved', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_authorized' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue(null);
    mockPaymentRepo.findById.mockResolvedValue(null);
    mockWebhookRepo.markFailed.mockResolvedValue(undefined);

    await expect(service.handleStripeWebhook(Buffer.from('{}'), 'sig')).rejects.toThrow(
      PaymentNotFoundException,
    );
    expect(mockWebhookRepo.markFailed).toHaveBeenCalled();
  });

  it('payment_authorized: transitions to AUTHORIZED and emits PaymentAuthorizedEvent', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_authorized' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue(processingPayment);
    mockPaymentRepo.updateState.mockResolvedValue({ ...processingPayment, state: PaymentState.AUTHORIZED });
    mockWebhookRepo.markProcessed.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
      'pay-1',
      expect.objectContaining({ state: PaymentState.AUTHORIZED }),
    );
    expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentAuthorizedEvent));
    expect(result.status).toBe('processed');
    expect(result.duplicate).toBe(false);
  });

  it('payment_captured: transitions to CAPTURED, creates capture event, emits PaymentCapturedEvent', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_captured' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue(processingPayment);
    mockPaymentRepo.createCaptureEvent.mockResolvedValue(undefined);
    mockPaymentRepo.updateState.mockResolvedValue({ ...processingPayment, state: PaymentState.CAPTURED });
    mockWebhookRepo.markProcessed.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(mockPaymentRepo.createCaptureEvent).toHaveBeenCalledWith('pay-1', 300);
    expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
      'pay-1',
      expect.objectContaining({ state: PaymentState.CAPTURED }),
    );
    expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentCapturedEvent));
    expect(result.status).toBe('processed');
  });

  it('payment_failed: transitions to FAILED and emits PaymentFailedEvent', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({
      ...parsedBase,
      eventType: 'payment_failed',
      errorMessage: 'Insufficient funds',
    });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue(processingPayment);
    mockPaymentRepo.updateState.mockResolvedValue({ ...processingPayment, state: PaymentState.FAILED });
    mockWebhookRepo.markProcessed.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
      'pay-1',
      expect.objectContaining({ state: PaymentState.FAILED }),
    );
    expect(mockEventBus.emit).toHaveBeenCalledWith(expect.any(PaymentFailedEvent));
    expect(result.status).toBe('processed');
  });

  it('payment_canceled: transitions to VOID without emitting business event', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_canceled' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue(processingPayment);
    mockPaymentRepo.updateState.mockResolvedValue({ ...processingPayment, state: PaymentState.VOID });
    mockWebhookRepo.markProcessed.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(mockPaymentRepo.updateState).toHaveBeenCalledWith(
      'pay-1',
      expect.objectContaining({ state: PaymentState.VOID }),
    );
    expect(mockEventBus.emit).not.toHaveBeenCalled();
    expect(result.status).toBe('processed');
  });

  it('returns ignored when current and target state are the same (idempotent delivery)', async () => {
    // Payment already AUTHORIZED, receiving payment_authorized again
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_authorized' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue({
      ...processingPayment,
      state: PaymentState.AUTHORIZED,
    });
    mockWebhookRepo.markIgnored.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(result.status).toBe('ignored');
    expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
    expect(mockEventBus.emit).not.toHaveBeenCalled();
  });

  it('ignores transition attempt from CAPTURED (terminal state)', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_authorized' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue({
      ...processingPayment,
      state: PaymentState.CAPTURED,
    });
    mockWebhookRepo.markIgnored.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(result.status).toBe('ignored');
    expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
  });

  it('ignores transition attempt from VOID (terminal state)', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_failed' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue({
      ...processingPayment,
      state: PaymentState.VOID,
    });
    mockWebhookRepo.markIgnored.mockResolvedValue(undefined);

    const result = await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(result.status).toBe('ignored');
    expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
  });

  it('throws InvalidPaymentStateTransitionException for an invalid state jump (PENDING → CAPTURED)', async () => {
    // PENDING → CAPTURED is not in the allowed transitions
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_captured' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue({
      ...processingPayment,
      state: PaymentState.PENDING,
    });

    await expect(service.handleStripeWebhook(Buffer.from('{}'), 'sig')).rejects.toThrow(
      InvalidPaymentStateTransitionException,
    );
    expect(mockPaymentRepo.updateState).not.toHaveBeenCalled();
  });

  it('marks delivery processed after successful state transition', async () => {
    mockProcessor.parseWebhookEvent.mockReturnValue({ ...parsedBase, eventType: 'payment_authorized' });
    mockWebhookRepo.createOrGet.mockResolvedValue(pendingDelivery);
    mockPaymentRepo.findByPaymentIntentId.mockResolvedValue(processingPayment);
    mockPaymentRepo.updateState.mockResolvedValue({ ...processingPayment, state: PaymentState.AUTHORIZED });
    mockWebhookRepo.markProcessed.mockResolvedValue(undefined);

    await service.handleStripeWebhook(Buffer.from('{}'), 'sig');

    expect(mockWebhookRepo.markProcessed).toHaveBeenCalledWith('wh-1', 'pay-1', 'pi_123');
  });
});
