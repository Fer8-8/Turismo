import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class PromotionActionType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  promotion_id: string | null;

  @Field(() => String, { nullable: true })
  type: string | null;

  @Field(() => String, { nullable: true })
  preferences: string | null;

  @Field(() => Int, { nullable: true })
  position: number | null;

  @Field(() => Date, { nullable: true })
  deleted_at: Date | null;

  @Field(() => Date, { nullable: true })
  created_at: Date | null;

  @Field(() => Date, { nullable: true })
  updated_at: Date | null;
}
