import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field(() => String, { description: 'First name of the address' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Field(() => String, { description: 'Last name of the address' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Field(() => String, { description: 'Address line 1 of the address' })
  @IsNotEmpty()
  @IsString()
  address1: string;

  @Field(() => String, {
    description: 'Address line 2 of the address',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  address2?: string | null;

  @Field(() => String, { description: 'City of the address' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @Field(() => String, { description: 'Zipcode of the address' })
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @Field(() => String, { description: 'Phone of the address' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @Field(() => String, {
    description: 'Alternative phone of the address',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  alternative_phone?: string | null;

  @Field(() => String, {
    description: 'Company of the address',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  company?: string | null;

  @Field(() => ID, { description: 'State ID of the address' })
  @IsUUID()
  state_id: string;

  @Field(() => String, {
    description: 'Country ID of the address',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  country_id?: string | null;

  @Field(() => String, {
    description: 'User ID of the address',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  user_id?: string | null;

  @Field(() => String, { description: 'Label of the address', nullable: true })
  @IsOptional()
  @IsString()
  label?: string | null;
}
