import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PromotionUsageAvailabilityType {
  @Field(() => ID)
  promotionId: string;

  @Field(() => Int, { nullable: true })
  usageLimit: number | null;

  @Field(() => Int)
  usageCount: number;

  @Field(() => Int, { nullable: true })
  remainingUsage: number | null;

  @Field()
  hasAvailability: boolean;
}
