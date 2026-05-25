import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateVariantInput } from './create-variant.input';

@InputType()
export class UpdateVariantInput extends PartialType(CreateVariantInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
