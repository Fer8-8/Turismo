import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductsTaxon {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  product_id?: string;

  @Field(() => String, { nullable: true })
  taxon_id?: string;

  @Field(() => Int, { nullable: true })
  position?: number;
}
