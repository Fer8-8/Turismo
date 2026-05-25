import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusService } from './event-bus.service';
import { OutboxService } from '../outbox/outbox.service';
import { OrderCreatedEvent } from '../events/index';

describe('EventBusService', () => {
  let service: EventBusService;
  let emitter: EventEmitter2;
  let outboxService: { save: jest.Mock };

  beforeEach(async () => {
    outboxService = { save: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' })],
      providers: [
        EventBusService,
        { provide: OutboxService, useValue: outboxService },
      ],
    }).compile();

    service = module.get<EventBusService>(EventBusService);
    emitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emit', () => {
    it('should save to outbox before emitting', async () => {
      const event = new OrderCreatedEvent('order-1', 'store-1', 'user-1', ['li-1', 'li-2'], 100);

      await service.emit(event);

      expect(outboxService.save).toHaveBeenCalledWith(event);
    });

    it('should emit an event through the EventEmitter2', async () => {
      const spy = jest.spyOn(emitter, 'emit');
      const event = new OrderCreatedEvent('order-1', 'store-1', 'user-1', ['li-1', 'li-2'], 100);

      await service.emit(event);

      expect(spy).toHaveBeenCalledWith(OrderCreatedEvent.eventName, event);
    });

    it('should not throw when no listeners are registered', async () => {
      const event = new OrderCreatedEvent('order-1', 'store-1', 'user-1', ['li-1'], 50);

      await expect(service.emit(event)).resolves.toBeUndefined();
    });

    it('should rethrow when outboxService.save fails', async () => {
      outboxService.save.mockRejectedValue(new Error('DB error'));
      const event = new OrderCreatedEvent('order-1', 'store-1', 'user-1', ['li-1'], 50);

      await expect(service.emit(event)).rejects.toThrow('DB error');
    });
  });

  describe('emitAndWait', () => {
    it('should save to outbox before emitting', async () => {
      const event = new OrderCreatedEvent('order-1', 'store-1', 'user-1', ['li-1'], 200);

      await service.emitAndWait(event);

      expect(outboxService.save).toHaveBeenCalledWith(event);
    });

    it('should emit and wait for all listeners to complete', async () => {
      const spy = jest.spyOn(emitter, 'emitAsync');
      const event = new OrderCreatedEvent('order-1', 'store-1', 'user-1', ['li-1'], 200);

      await service.emitAndWait(event);

      expect(spy).toHaveBeenCalledWith(OrderCreatedEvent.eventName, event);
    });

    it('should call registered listener and await it', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      emitter.on(OrderCreatedEvent.eventName, handler);

      const event = new OrderCreatedEvent('order-2', 'store-1', 'user-1', ['li-1'], 300);

      await service.emitAndWait(event);

      expect(handler).toHaveBeenCalledWith(event);
    });
  });
});

