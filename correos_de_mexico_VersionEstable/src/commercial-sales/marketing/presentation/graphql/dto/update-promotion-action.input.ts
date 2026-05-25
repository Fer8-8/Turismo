import { InputType, Field, PartialType, OmitType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreatePromotionActionInput } from './create-promotion-action.input';

@InputType()
export class UpdatePromotionActionInput extends PartialType(OmitType(CreatePromotionActionInput, ['promotionId'] as const)) {
  @Field(()=> ID)
  @IsUUID()
  id: string;
}
