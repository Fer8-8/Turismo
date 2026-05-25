import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReturnAuthorizationReasonType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field()
  active: boolean;

  @Field()
  mutable: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}