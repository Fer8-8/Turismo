import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserStateChangeType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  previous_state?: string | null;

  @Field(() => String, { nullable: true })
  next_state?: string | null;

  @Field(() => String, { nullable: true })
  stateful_type?: string | null;

  @Field(() => String, { nullable: true })
  stateful_id?: string | null;

  @Field()
  created_at: Date;
}
