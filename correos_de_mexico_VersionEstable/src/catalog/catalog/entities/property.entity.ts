import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Property {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  presentation: string;

  @Field(() => Boolean)
  filterable: boolean;

  @Field(() => String, { nullable: true })
  filter_param?: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
