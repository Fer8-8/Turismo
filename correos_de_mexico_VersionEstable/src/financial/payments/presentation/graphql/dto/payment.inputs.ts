import { InputType, Field, ID, Float, PartialType } from '@nestjs/graphql';
import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID)
  @IsUUID()
  paymentMethodId: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  amount: number;
}

@InputType()
export class ProcessPaymentInput {
  @Field(() => ID)
  @IsUUID()
  paymentId: string;
}

@InputType()
export class CapturePaymentInput {
  @Field(() => ID)
  @IsUUID()
  paymentId: string;
}

@InputType()
export class CreatePaymentMethodInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  auto_capture?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  preferences?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  display_on?: string;
}

@InputType()
export class UpdatePaymentMethodInput extends PartialType(CreatePaymentMethodInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

@InputType()
export class PaymentMethodStoreInput {
  @Field(() => ID)
  @IsUUID()
  paymentMethodId: string;

  @Field(() => ID)
  @IsUUID()
  storeId: string;
}

@InputType()
export class PaymentScopeInput {
  @Field(() => ID)
  @IsUUID()
  paymentId: string;
}

@InputType()
export class OrderPaymentsInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;
}

@InputType()
export class PaymentRefundsInput {
  @Field(() => ID)
  @IsUUID()
  paymentId: string;
}

@InputType()
export class CreateRefundInput {
  @Field(() => ID)
  @IsUUID()
  paymentId: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field(() => ID)
  @IsUUID()
  refundReasonId: string;
}

@InputType()
export class CreateRefundReasonInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  mutable?: boolean;
}

@InputType()
export class UpdateRefundReasonInput extends PartialType (CreateRefundReasonInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
