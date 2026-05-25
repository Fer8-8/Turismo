import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateProductPropertyInput } from './create-product-property.input';

@InputType()
export class UpdateProductPropertyInput extends PartialType(
  CreateProductPropertyInput,
) {
  @Field(() => ID)
  id: string;
}
