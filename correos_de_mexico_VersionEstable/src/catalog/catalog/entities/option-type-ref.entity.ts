import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class OptionTypeRef {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  presentation?: string;
}
