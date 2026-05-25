import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateShippingCategoryInput {
  @Field(() => ID)
  @IsUUID()
  categoryId: string;

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
  @IsBoolean()
  isGlobal?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  storeId?: string;
}