import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignPromotionStoreInput {
  @Field(() => ID)
  @IsUUID()
  promotionId: string;

  @Field(() => ID)
  @IsUUID()
  storeId: string;
}
