import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { Float } from '@nestjs/graphql';

@InputType()
export class LinkPromotionOrderInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID)
  @IsUUID()
  promotionId: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  promoTotal?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  evaluationSnapshot?: string;
}
