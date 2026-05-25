import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateZoneInput } from './create-zone.input';

@InputType()
export class UpdateZoneInput extends PartialType(CreateZoneInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
