import { Module } from '@nestjs/common';
import { ActivitiesPlannerService } from './activities_planner.service';
import { ActivitiesPlannerResolver } from './activities_planner.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ActivitiesPlannerResolver, ActivitiesPlannerService],
})
export class ActivitiesPlannerModule {}
