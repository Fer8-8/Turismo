import { CreateRecommendationLogInput } from './create-recommendation-log.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRecommendationLogInput extends PartialType(CreateRecommendationLogInput) {
  @Field(() => ID)
  id: string;
}
