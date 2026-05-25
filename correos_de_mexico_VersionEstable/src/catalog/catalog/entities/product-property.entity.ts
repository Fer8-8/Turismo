import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductProperty {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  value?: string;

  @Field(() => String, { nullable: true })
  product_id?: string;

  @Field(() => String, { nullable: true })
  property_id?: string;

  @Field(() => Int)
  position: number;

  @Field(() => Boolean)
  show_property: boolean;

  @Field(() => String, { nullable: true })
  filter_param?: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
