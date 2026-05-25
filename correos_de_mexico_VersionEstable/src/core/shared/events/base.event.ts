import { randomUUID } from 'crypto';

export abstract class BaseEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;

  constructor(public readonly eventName: string) {
    this.eventId = randomUUID();
    this.occurredAt = new Date();
  }

  toPayload(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
    };
  }
}
