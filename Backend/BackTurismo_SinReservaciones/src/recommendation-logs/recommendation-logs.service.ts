import { Injectable } from '@nestjs/common';
import { CreateRecommendationLogInput } from './dto/create-recommendation-log.input';
import { UpdateRecommendationLogInput } from './dto/update-recommendation-log.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecommendationLog } from './entities/recommendation-log.entity';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { RecommendationLogsResponse } from './dto/recommendation-logs-response.dto';

@Injectable()
export class RecommendationLogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRecommendationLogInput: CreateRecommendationLogInput) {
    return this.prisma.recommendationLogs.create({
      data: createRecommendationLogInput,
      include: {
        User: true,
      },
    });
  }

  async findAll(paginationArgs: PaginationArgs): Promise<RecommendationLogsResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const [recommendationLogs, totalCount] = await Promise.all([
      this.prisma.recommendationLogs.findMany({
        skip,
        take: limit,
        include: {
          User: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.recommendationLogs.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      recommendationLogs,
    };
  }

  findOne(id: string): Promise<RecommendationLog> {
    return this.prisma.recommendationLogs.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        User: true,
      },
    });
  }


}
