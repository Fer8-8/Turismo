import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReturnItemReceptionStatus } from '../../../domain/enums/return-item-reception-status.enum';
import { ReturnItemAcceptanceStatus } from '../../../domain/enums/return-item-acceptance-status.enum';

@InputType()
export class EvaluateReturnItemInput {
  @Field(() => ID)
  @IsUUID()
  returnItemId: string;

  @Field(() => ReturnItemReceptionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReturnItemReceptionStatus)
  receptionStatus?: ReturnItemReceptionStatus;

  @Field(() => ReturnItemAcceptanceStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReturnItemAcceptanceStatus)
  acceptanceStatus?: ReturnItemAcceptanceStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  acceptanceStatusErrors?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  resellable?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  autoReintegrate?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  reintegrateToLocationId?: string;
}