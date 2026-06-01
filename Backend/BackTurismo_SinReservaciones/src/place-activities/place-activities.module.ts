import { Module } from '@nestjs/common';
import { PlaceActivitiesService } from './place-activities.service';
import { PlaceActivitiesResolver } from './place-activities.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PlaceActivitiesResolver, PlaceActivitiesService],
  imports: [PrismaModule]
})
export class PlaceActivitiesModule {}
