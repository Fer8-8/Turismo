import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  Min,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreatePromotionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @Field({ nullable: true, defaultValue: 'all' })
  @IsOptional()
  @IsString()
  match_policy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  starts_at?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  usage_limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  advertise?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  path?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  promotion_category_id?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsUUID('4', { each: true })
  store_ids?: string[];
}