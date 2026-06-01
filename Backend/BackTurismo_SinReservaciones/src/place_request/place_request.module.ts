import { Module } from '@nestjs/common';
import { PlaceRequestService } from './place_request.service';
import { PlaceRequestResolver } from './place_request.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlacesModule } from 'src/places/places.module';

@Module({
  imports: [PrismaModule, PlacesModule],
  providers: [PlaceRequestResolver, PlaceRequestService],
})
export class PlaceRequestModule {}
