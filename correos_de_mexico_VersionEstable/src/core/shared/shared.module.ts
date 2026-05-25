import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { EventBusService } from './event-bus/event-bus.service';
import { OutboxService } from './outbox/outbox.service';
import { OutboxProcessor } from './outbox/outbox.processor';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      // habilita wildcards para escuchar patrones
      wildcard: true,
      // separador para patrones wildcard eventos
      delimiter: '.',
      // límite listeners por evento prevención memory leaks
      maxListeners: 20,
    }),
  ],
  providers: [EventBusService, OutboxService, OutboxProcessor],
  exports: [EventBusService, OutboxService, OutboxProcessor],
})
export class SharedModule {}
