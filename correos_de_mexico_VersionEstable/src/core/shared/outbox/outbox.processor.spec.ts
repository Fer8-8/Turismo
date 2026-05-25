import { OutboxProcessor } from './outbox.processor';

describe('OutboxProcessor', () => {
  let processor: OutboxProcessor;
  let outboxService: {
    getPending: jest.Mock;
    markAsProcessed: jest.Mock;
    markAsFailed: jest.Mock;
    retry: jest.Mock;
    cleanupProcessed: jest.Mock;
  };
  let eventBusService: {
    emitAndWait: jest.Mock;
  };

  const eventRecord = {
    eventId: 'event-1',
    eventName: 'order.created',
    payload: {
      eventId: 'event-1',
      eventName: 'order.created',
      occurredAt: '2026-04-01T00:00:00.000Z',
      orderId: 'order-1',
    },
  };

  beforeEach(() => {
    outboxService = {
      getPending: jest.fn(),
      markAsProcessed: jest.fn(),
      markAsFailed: jest.fn(),
      retry: jest.fn(),
      cleanupProcessed: jest.fn(),
    };
    eventBusService = {
      emitAndWait: jest.fn(),
    };

    processor = new OutboxProcessor(
      outboxService as any,
      eventBusService as any,
    );
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('processOutbox', () => {
    it('should skip processing when another run is already in progress', async () => {
      (processor as unknown as { isProcessing: boolean }).isProcessing = true;

      await processor.processOutbox();

      expect(outboxService.getPending).not.toHaveBeenCalled();
    });

    it('should mark the event as processed after a successful emission', async () => {
      outboxService.getPending.mockResolvedValue([eventRecord]);
      eventBusService.emitAndWait.mockResolvedValue(undefined);
      outboxService.markAsProcessed.mockResolvedValue(undefined);

      await processor.processOutbox();

      expect(eventBusService.emitAndWait).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'event-1',
          eventName: 'order.created',
          occurredAt: new Date('2026-04-01T00:00:00.000Z'),
        }),
      );
      expect(outboxService.markAsProcessed).toHaveBeenCalledWith('event-1');
      expect(outboxService.markAsFailed).not.toHaveBeenCalled();
    });

    it('should mark the event as failed when emission throws', async () => {
      outboxService.getPending.mockResolvedValue([eventRecord]);
      eventBusService.emitAndWait.mockRejectedValue(new Error('listener failed'));
      outboxService.markAsFailed.mockResolvedValue(undefined);

      await processor.processOutbox();

      expect(outboxService.markAsFailed).toHaveBeenCalledWith(
        'event-1',
        'listener failed',
      );
      expect(outboxService.markAsProcessed).not.toHaveBeenCalled();
    });
  });

  describe('retryFailedEvent', () => {
    it('should reset the event and process it again', async () => {
      outboxService.retry.mockResolvedValue(eventRecord);
      eventBusService.emitAndWait.mockResolvedValue(undefined);
      outboxService.markAsProcessed.mockResolvedValue(undefined);

      await processor.retryFailedEvent('event-1');

      expect(outboxService.retry).toHaveBeenCalledWith('event-1');
      expect(outboxService.markAsProcessed).toHaveBeenCalledWith('event-1');
    });
  });

  describe('cleanup', () => {
    it('should clean processed events using the default retention window', async () => {
      outboxService.cleanupProcessed.mockResolvedValue(4);

      await processor.cleanup();

      expect(outboxService.cleanupProcessed).toHaveBeenCalledWith(30);
    });
  });
});