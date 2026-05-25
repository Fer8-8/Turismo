import { Module } from '@nestjs/common';
import { StoreService } from './services/store.service';
import { StoreResolver } from './resolvers/store.resolver';
import { StoreFacade } from './facades/store.facade';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StoreService, StoreResolver, StoreFacade],
  exports: [StoreService, StoreFacade],
})
export class StoreModule {}
