import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, Min } from 'class-validator';

@InputType()
export class AddLineItemInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID)
  @IsUUID()
  variantId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}
