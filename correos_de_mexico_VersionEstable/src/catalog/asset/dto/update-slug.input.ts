import { InputType, Field, ID, PartialType, OmitType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateSlugInput } from './create-slug.input';

@InputType()
export class UpdateSlugInput extends PartialType(OmitType(CreateSlugInput, ['sluggable_type', 'sluggable_id'] as const)) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
