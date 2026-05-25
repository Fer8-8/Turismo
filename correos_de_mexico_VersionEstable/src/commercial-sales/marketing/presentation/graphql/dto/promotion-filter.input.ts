import { Field, ID, Int, ArgsType } from '@nestjs/graphql';
import { IsOptional, IsBoolean, IsInt, IsDateString, IsUUID, Min, IsString } from 'class-validator';

@ArgsType()
export class PromotionFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  since?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  until?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
}
