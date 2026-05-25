import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class TaxZone {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field()
  default_tax: boolean;

  @Field(() => Int)
  zone_members_count: number;

  @Field()
  kind: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
