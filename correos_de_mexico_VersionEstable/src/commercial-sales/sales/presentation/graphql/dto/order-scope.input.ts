import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class OrderScopeInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;
}
