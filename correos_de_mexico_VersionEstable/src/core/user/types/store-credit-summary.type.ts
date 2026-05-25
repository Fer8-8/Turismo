import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class UserStoreCreditSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  amount_used: number;

  @Field(() => Float)
  amount_authorized: number;

  @Field(() => String, { nullable: true })
  memo?: string | null;

  @Field(() => String, { nullable: true })
  currency?: string | null;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date | null;
}
