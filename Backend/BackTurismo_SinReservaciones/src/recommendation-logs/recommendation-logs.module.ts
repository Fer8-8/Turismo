import { Module } from '@nestjs/common';
import { RecommendationLogsService } from './recommendation-logs.service';
import { RecommendationLogsResolver } from './recommendation-logs.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  providers: [RecommendationLogsResolver, RecommendationLogsService],
  imports: [PrismaModule],
})
export class RecommendationLogsModule {}
