import { InputType, Field, ID, OmitType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { AddLineItemInput } from './add-line-item.input';

@InputType()
export class UpdateLineItemInput extends OmitType(AddLineItemInput, ['variantId'] as const) {
  @Field(() => ID)
  @IsUUID()
  lineItemId: string;
}
