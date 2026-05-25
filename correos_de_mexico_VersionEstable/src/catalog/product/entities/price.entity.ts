import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Price {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  variant_id: string;

  @Field(() => String, { nullable: true })
  amount?: string;

  @Field(() => String, { nullable: true })
  currency?: string;

  @Field(() => String, { nullable: true })
  compare_at_amount?: string;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
