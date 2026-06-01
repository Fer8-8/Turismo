import { Field, ObjectType } from '@nestjs/graphql';
import { RecommendationLog } from '../entities/recommendation-log.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class RecommendationLogsResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [RecommendationLog])
  recommendationLogs: RecommendationLog[];
}
