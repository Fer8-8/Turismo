import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';

@InputType()
export class AssignOrderAddressInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  shipAddressId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  billAddressId?: string;
}
