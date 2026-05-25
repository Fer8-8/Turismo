import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class AddReturnItemInput {
  @Field(() => ID)
  @IsUUID()
  returnAuthorizationId: string;

  @Field(() => ID)
  @IsUUID()
  inventoryUnitId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  exchangeVariantId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  resellable?: boolean;
}