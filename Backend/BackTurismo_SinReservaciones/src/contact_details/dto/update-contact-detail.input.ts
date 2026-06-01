import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateContactInput } from './create-contact-detail.input';

@InputType()
export class UpdateContactInput extends PartialType(CreateContactInput) {
  @Field(() => ID)
  id: string; // El ID es obligatorio para saber qué registro actualizar
}