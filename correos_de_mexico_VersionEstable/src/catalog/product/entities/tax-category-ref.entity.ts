import { ObjectType, Field, ID } from '@nestjs/graphql';

// referencia ligera a categoría fiscal del producto
@ObjectType()
export class TaxCategoryRef {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  tax_code?: string;

  @Field(() => Boolean)
  is_default: boolean;
}
