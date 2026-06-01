import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [PrismaModule, PlacesModule],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
