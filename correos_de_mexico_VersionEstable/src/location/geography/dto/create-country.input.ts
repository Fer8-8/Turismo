import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';

@InputType()
export class CreateCountryInput {
  @Field()
  @IsString()
  @Length(1, 255)
  iso_name: string;

  @Field()
  @IsString()
  @Length(2, 2)
  iso: string;

  @Field()
  @IsString()
  @Length(3, 3)
  iso3: string;

  @Field()
  @IsString()
  @Length(1, 255)
  name: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  numcode?: number;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  states_required?: boolean;

  @Field({ nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  zipcode_required?: boolean;
}
