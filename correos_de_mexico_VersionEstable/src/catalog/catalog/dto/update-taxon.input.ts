import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateTaxonInput } from './create-taxon.input';

@InputType()
export class UpdateTaxonInput extends PartialType(CreateTaxonInput) {
  @Field(() => ID)
  id: string;
}
