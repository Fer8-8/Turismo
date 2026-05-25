import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SharedModule } from './shared.module';
import { EventBusService } from './event-bus/event-bus.service';

describe('SharedModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide EventBusService', () => {
    const eventBus = module.get<EventBusService>(EventBusService);
    expect(eventBus).toBeDefined();
  });

  it('EventBusService should be a singleton (global module)', async () => {
    const eventBus1 = module.get<EventBusService>(EventBusService);
    const eventBus2 = module.get<EventBusService>(EventBusService);
    expect(eventBus1).toBe(eventBus2);
  });
});
