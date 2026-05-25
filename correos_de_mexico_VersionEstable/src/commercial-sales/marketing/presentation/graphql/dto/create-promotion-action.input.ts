import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

@InputType()
export class CreatePromotionActionInput {
  @Field(() => ID)
  @IsUUID()
  promotionId: string;

  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  preferences: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;
}
