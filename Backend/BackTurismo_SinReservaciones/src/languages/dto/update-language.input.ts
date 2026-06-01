import { CreateLanguageInput } from './create-language.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateLanguageInput extends PartialType(CreateLanguageInput) {
  @IsUUID()
  @Field( () => String )
  id: string
}
