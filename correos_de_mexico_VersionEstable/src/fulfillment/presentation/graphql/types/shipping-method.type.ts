import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShippingMethodType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => String, { nullable: true })
  display_on: string | null;

  @Field()
  active: boolean;

  @Field()
  is_global: boolean;

  @Field(() => ID, { nullable: true })
  store_id: string | null;

  @Field(() => String, { nullable: true })
  tracking_url: string | null;

  @Field(() => String, { nullable: true })
  admin_name: string | null;

  @Field(() => ID, { nullable: true })
  tax_category_id: string | null;

  @Field(() => String, { nullable: true })
  configuration: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}