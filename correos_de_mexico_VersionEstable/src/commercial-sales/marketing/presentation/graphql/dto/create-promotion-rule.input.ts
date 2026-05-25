import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

@InputType()
export class CreatePromotionRuleInput {
  @Field(() => ID)
  @IsUUID()
  promotionId: string;

  @Field()
  @IsString()
  type: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  preferences?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  product_ids?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  user_ids?: string[];
}
