import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { BaseEvent } from '../events/base.event';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly eventBusService: EventBusService,
  ) {}

  // procesa eventos pendientes cada 5 segundos (polling)
  @Cron(CronExpression.EVERY_5_SECONDS)
  async processOutbox(): Promise<void> {
    // evita ejecución concurrente
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const pendingEvents = await this.outboxService.getPending(10);

      if (pendingEvents.length === 0) {
        return;
      }

      this.logger.debug(
        `Processing ${pendingEvents.length} pending events from outbox`,
      );

      for (const eventRecord of pendingEvents) {
        await this.processEvent(eventRecord);
      }
    } catch (error) {
      this.logger.error(
        `Error processing outbox: ${error.message}`,
        error.stack,
      );
    } finally {
      this.isProcessing = false;
    }
  }

  // procesa un evento individual con reintentos
  private async processEvent(eventRecord: any): Promise<void> {
    try {
      const event = this.reconstructEvent(eventRecord.payload);

      await this.eventBusService.emitAndWait(event);

      await this.outboxService.markAsProcessed(eventRecord.eventId);

      this.logger.log(
        `Event processed successfully: ${eventRecord.eventName} (${eventRecord.eventId})`,
      );
    } catch (error) {
      await this.outboxService.markAsFailed(
        eventRecord.eventId,
        error.message,
      );

      this.logger.warn(
        `Event processing failed: ${eventRecord.eventName} (${eventRecord.eventId}) - ${error.message}`,
      );
    }
  }

  // reconstruye el evento desde el payload guardado
  // pendiente: usar deserialización más robusta en producción
  private reconstructEvent(payload: Record<string, unknown>): BaseEvent {
    // retorna un evento genérico, en el futuro usar un factory
    return {
      eventId: payload.eventId as string,
      eventName: payload.eventName as string,
      occurredAt: new Date(payload.occurredAt as string),
      toPayload: () => payload,
    } as BaseEvent;
  }

  // reprocesa manualmente un evento fallido
  async retryFailedEvent(eventId: string): Promise<void> {
    const event = await this.outboxService.retry(eventId);
    this.logger.log(`Retrying failed event: ${eventId}`);
    await this.processEvent(event);
  }

  // limpia eventos procesados antiguos
  @Cron('0 2 * * *') // 2 am cada día
  async cleanup(): Promise<void> {
    try {
      const cleaned = await this.outboxService.cleanupProcessed(30); // retiene 30 días
      this.logger.log(`Outbox cleanup completed: ${cleaned} events removed`);
    } catch (error) {
      this.logger.error(`Error during outbox cleanup: ${error.message}`);
    }
  }
}
