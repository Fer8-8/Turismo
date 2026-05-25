import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Prototype {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
