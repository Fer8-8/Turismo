import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateReturnAuthorizationStateInput {
  @Field(() => ID)
  @IsUUID()
  returnAuthorizationId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  memo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  reintegrateAcceptedItems?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  locationId?: string;
}