import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ZoneMember {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  zoneable_type?: string;

  @Field(() => ID, { nullable: true })
  zoneable_id?: string;

  @Field(() => ID, { nullable: true })
  zone_id?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
