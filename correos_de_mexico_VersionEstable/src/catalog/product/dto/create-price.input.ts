import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

@InputType()
export class CreatePriceInput {
  @Field(() => ID)
  @IsUUID(undefined, { message: 'variant_id debe ser UUID válido' })
  variant_id: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  compare_at_amount?: number;
}
