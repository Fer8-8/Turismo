import { Module } from '@nestjs/common';
import { PlaceAttributesService } from './place-attributes.service';
import { PlaceAttributesResolver } from './place-attributes.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PlaceAttributesResolver, PlaceAttributesService],
  imports: [PrismaModule]
})
export class PlaceAttributesModule {}
