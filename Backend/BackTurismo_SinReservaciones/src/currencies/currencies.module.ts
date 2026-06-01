import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesResolver } from './currencies.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CurrenciesResolver, CurrenciesService],
  imports: [PrismaModule]
})
export class CurrenciesModule {}
