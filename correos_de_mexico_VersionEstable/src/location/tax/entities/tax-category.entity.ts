import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TaxCategory {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field()
  is_default: boolean;

  @Field(() => String, { nullable: true })
  tax_code?: string;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
