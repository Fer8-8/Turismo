import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShipmentTrackingType {
  @Field(() => ID)
  shipmentId: string;

  @Field(() => String, { nullable: true })
  tracking: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => Date, { nullable: true })
  shippedAt: Date | null;

  @Field(() => Date, { nullable: true })
  deliveredAt: Date | null;
}