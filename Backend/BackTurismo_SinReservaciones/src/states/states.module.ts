import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesResolver } from './states.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [StatesResolver, StatesService],
  imports: [PrismaModule],
})
export class StatesModule {}
