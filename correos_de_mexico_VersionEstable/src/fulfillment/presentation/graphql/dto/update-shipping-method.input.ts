import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateShippingMethodInput {
  @Field(() => ID)
  @IsUUID()
  methodId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  displayOn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  adminName?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  taxCategoryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  configuration?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  storeId?: string;
}