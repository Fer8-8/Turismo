import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserRoleType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => Date, { nullable: true })
  created_at?: Date | null;
}
