import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ReturnAuthorizationState } from '../../../domain/enums/return-authorization-state.enum';

@InputType()
export class ReturnAuthorizationFiltersInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @Field(() => ReturnAuthorizationState, { nullable: true })
  @IsOptional()
  @IsEnum(ReturnAuthorizationState)
  state?: ReturnAuthorizationState;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  reasonId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;
}