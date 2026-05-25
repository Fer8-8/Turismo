import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShippingCategoryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field()
  is_global: boolean;

  @Field(() => ID, { nullable: true })
  store_id: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}