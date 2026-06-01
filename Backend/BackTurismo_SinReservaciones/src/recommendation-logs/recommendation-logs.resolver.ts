import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RecommendationLogsService } from './recommendation-logs.service';
import { RecommendationLog } from './entities/recommendation-log.entity';
import { CreateRecommendationLogInput } from './dto/create-recommendation-log.input';
import { UpdateRecommendationLogInput } from './dto/update-recommendation-log.input';
import { RecommendationLogsResponse } from './dto/recommendation-logs-response.dto';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';

@Resolver(() => RecommendationLog)
export class RecommendationLogsResolver {
  constructor(private readonly recommendationLogsService: RecommendationLogsService) {}

  @Mutation(() => RecommendationLog)
  createRecommendationLog(@Args('createRecommendationLogInput') createRecommendationLogInput: CreateRecommendationLogInput) {
    return this.recommendationLogsService.create(createRecommendationLogInput);
  }

  @Query(() => RecommendationLogsResponse, { name: 'recommendationLogs' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.recommendationLogsService.findAll(paginationArgs);
  }

  @Query(() => RecommendationLog, { name: 'recommendationLog' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.recommendationLogsService.findOne(id);
  }

}
