import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SelectShippingRateInput {
  @Field(() => ID)
  @IsUUID()
  rateId: string;
}