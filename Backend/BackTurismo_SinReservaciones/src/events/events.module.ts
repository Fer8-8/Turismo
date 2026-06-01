import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [EventsResolver, EventsService],
  imports: [PrismaModule]
})
export class EventsModule {}
