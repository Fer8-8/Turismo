import { Module } from '@nestjs/common';
import { PlacefeaturecacheService } from './placefeaturecache.service';
import { PlacefeaturecacheResolver } from './placefeaturecache.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlacefeaturecacheResolver, PlacefeaturecacheService],
})
export class PlacefeaturecacheModule {}
