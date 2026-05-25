import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString } from 'class-validator';

@InputType()
export class CancelOrderInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;
}
