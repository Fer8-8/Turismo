import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class SetShipmentTrackingInput {
  @Field(() => ID)
  @IsUUID()
  shipmentId: string;

  @Field()
  @IsString()
  tracking: string;
}