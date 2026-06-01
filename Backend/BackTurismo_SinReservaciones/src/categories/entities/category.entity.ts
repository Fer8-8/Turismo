import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID)
  id_category: string;

  @Field()
  category: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
