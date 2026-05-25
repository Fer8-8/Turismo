import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class FriendlySlug {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  sluggable_type: string;

  @Field(() => String, { nullable: true })
  sluggable_id?: string;

  @Field(() => String, { nullable: true })
  scope?: string;

  @Field(() => Boolean)
  is_primary: boolean;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
