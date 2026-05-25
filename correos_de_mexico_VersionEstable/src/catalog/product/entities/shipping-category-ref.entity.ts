import { ObjectType, Field, ID } from '@nestjs/graphql';

// referencia ligera a categoría de envío del producto
@ObjectType()
export class ShippingCategoryRef {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;
}
