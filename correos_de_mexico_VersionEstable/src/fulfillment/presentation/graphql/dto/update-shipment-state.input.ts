import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class UpdateShipmentStateInput {
  @Field(() => ID)
  @IsUUID()
  shipmentId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}