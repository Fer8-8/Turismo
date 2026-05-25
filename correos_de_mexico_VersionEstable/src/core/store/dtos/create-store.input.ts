import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class CreateStoreInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  code: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  default_currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  default_locale?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  customer_support_email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  new_order_notifications_email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  mail_from_address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  default_country_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  checkout_zone_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_phone?: string;
}
