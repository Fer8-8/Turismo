import { InputType, Field, ID, Int, PartialType } from '@nestjs/graphql';
import { CreateTaxonomyInput } from './create-taxonomy.input';

@InputType()
export class UpdateTaxonomyInput extends PartialType(CreateTaxonomyInput) {
  @Field(() => ID)
  id: string;
}
