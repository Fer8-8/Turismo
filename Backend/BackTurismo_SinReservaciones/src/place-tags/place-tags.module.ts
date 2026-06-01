import { Module } from '@nestjs/common';
import { PlaceTagsService } from './place-tags.service';
import { PlaceTagsResolver } from './place-tags.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PlaceTagsResolver, PlaceTagsService],
  imports: [PrismaModule],
})
export class PlaceTagsModule {}
