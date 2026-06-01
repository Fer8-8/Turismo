import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Info {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  pages: number;

  @Field(() => Int, { nullable: true })
  next?: number;

  @Field(() => Int, { nullable: true })
  prev?: number;
}
