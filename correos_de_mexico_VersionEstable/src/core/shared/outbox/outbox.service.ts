import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseEvent } from '../events/base.event';

export interface OutboxEventRecord {
  id: string;
  eventName: string;
  eventId: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  createdAt: Date;
  processedAt: Date | null;
  failedAt: Date | null;
  lastError: string | null;
  retryCount: number;
  maxRetries: number;
}

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(private readonly prisma: PrismaService) {}

// registra eventos para procesamiento asincronico
  async save(event: BaseEvent): Promise<OutboxEventRecord> {
    try {
      const payload = event.toPayload();

      const outboxEvent = await this.prisma.outboxEvent.create({
        data: {
          eventName: event.eventName,
          eventId: event.eventId,
          payload: payload as any, // Prisma JSON type is flexible
          status: 'PENDING',
          retryCount: 0,
          maxRetries: 3,
        },
      });

      this.logger.debug(
        `Event saved to outbox: eventId=${event.eventId}, name=${event.eventName}`,
      );

      return outboxEvent as OutboxEventRecord;
    } catch (error) {
      this.logger.error(`Failed to save event to outbox: ${error.message}`);
      throw error;
    }
  }

  // obtiene eventos pendientes para procesamiento
  async getPending(limit: number = 10): Promise<OutboxEventRecord[]> {
    return this.prisma.outboxEvent.findMany({
      where: {
        status: 'PENDING',
        retryCount: { lt: (await this.getMaxRetries()) },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    }) as Promise<OutboxEventRecord[]>;
  }

  // marca un evento como procesado
  async markAsProcessed(eventId: string): Promise<OutboxEventRecord> {
    return this.prisma.outboxEvent.update({
      where: { eventId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    }) as Promise<OutboxEventRecord>;
  }

  // marca como fallido e incrementa reintentos
  async markAsFailed(
    eventId: string,
    error: string,
  ): Promise<OutboxEventRecord> {
    const record = await this.prisma.outboxEvent.findUniqueOrThrow({
      where: { eventId },
    });

    const newRetryCount = (record.retryCount as number) + 1;
    const maxRetries = record.maxRetries as number;

    const status = newRetryCount >= maxRetries ? 'FAILED' : 'PENDING';

    return this.prisma.outboxEvent.update({
      where: { eventId },
      data: {
        status,
        retryCount: newRetryCount,
        failedAt: status === 'FAILED' ? new Date() : null,
        lastError: error,
      },
    }) as Promise<OutboxEventRecord>;
  }

  // obtiene eventos fallidos para revisión manual
  async getFailedEvents(limit: number = 100): Promise<OutboxEventRecord[]> {
    return this.prisma.outboxEvent.findMany({
      where: { status: 'FAILED' },
      orderBy: { failedAt: 'desc' },
      take: limit,
    }) as Promise<OutboxEventRecord[]>;
  }

  // reintenta un evento fallido
  async retry(eventId: string): Promise<OutboxEventRecord> {
    return this.prisma.outboxEvent.update({
      where: { eventId },
      data: {
        status: 'PENDING',
        retryCount: 0,
        failedAt: null,
        lastError: null,
      },
    }) as Promise<OutboxEventRecord>;
  }

  // limpia eventos procesados más antiguos que x días
  async cleanupProcessed(retentionDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.prisma.outboxEvent.deleteMany({
      where: {
        status: 'PROCESSED',
        processedAt: { lt: cutoffDate },
      },
    });

    this.logger.log(`Cleaned up ${result.count} processed events`);
    return result.count;
  }

  private async getMaxRetries(): Promise<number> {
    return 3; // Configurable desde environment en el futuro
  }
}
