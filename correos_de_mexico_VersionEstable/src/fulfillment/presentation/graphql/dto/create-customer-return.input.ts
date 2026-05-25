import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateCustomerReturnInput {
  @Field(() => ID)
  @IsUUID()
  returnAuthorizationId: string;

  @Field(() => [ID])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  itemIds: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  stockLocationId?: string;
}