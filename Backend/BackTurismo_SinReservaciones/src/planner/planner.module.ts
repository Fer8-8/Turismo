import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerResolver } from './planner.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PlannerResolver, PlannerService],
  imports: [PrismaModule],
})
export class PlannerModule {}
