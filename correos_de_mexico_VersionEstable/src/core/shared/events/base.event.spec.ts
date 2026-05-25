import { BaseEvent } from './base.event';

class TestEvent extends BaseEvent {
  static readonly eventName = 'test.event';

  constructor(public readonly data: string) {
    super(TestEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      data: this.data,
    };
  }
}

describe('BaseEvent', () => {
  it('should create an event with a unique eventId', () => {
    const event = new TestEvent('hello');

    expect(event.eventId).toBeDefined();
    expect(typeof event.eventId).toBe('string');
    expect(event.eventId.length).toBeGreaterThan(0);
  });

  it('should set occurredAt to current time', () => {
    const before = new Date();
    const event = new TestEvent('hello');
    const after = new Date();

    expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should set the eventName from constructor', () => {
    const event = new TestEvent('hello');

    expect(event.eventName).toBe('test.event');
  });

  it('should generate unique eventIds for different instances', () => {
    const event1 = new TestEvent('hello');
    const event2 = new TestEvent('world');

    expect(event1.eventId).not.toBe(event2.eventId);
  });

  it('toPayload should include base fields', () => {
    const event = new TestEvent('hello');
    const payload = event.toPayload();

    expect(payload).toEqual({
      eventId: event.eventId,
      eventName: 'test.event',
      occurredAt: event.occurredAt.toISOString(),
      data: 'hello',
    });
  });
});
