import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class AvailableShippingMethodsInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  shippingCategoryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;
}