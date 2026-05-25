import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseEvent } from '../events/base.event';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly outboxService: OutboxService,
  ) {}

  // emite un evento y lo guarda para recuperación si falla
  async emit(event: BaseEvent): Promise<void> {
    try {
      await this.outboxService.save(event);
      this.logger.log(
        `Emitting event [${event.eventName}] id=${event.eventId}`,
      );
      this.eventEmitter.emit(event.eventName, event);
    } catch (error) {
      this.logger.error(
        `Error emitting event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // emite un evento y espera a que todos los listeners terminen
  async emitAndWait(event: BaseEvent): Promise<void> {
    try {
      await this.outboxService.save(event);
      this.logger.log(
        `Emitting event (wait) [${event.eventName}] id=${event.eventId}`,
      );
      await this.eventEmitter.emitAsync(event.eventName, event);
    } catch (error) {
      this.logger.error(
        `Error emitting event (wait): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
