import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class OrderHistoryInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

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
