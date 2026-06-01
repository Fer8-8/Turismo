import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsString, IsDate, IsOptional } from 'class-validator';
import { ValidRegions } from '../enums/valid-regions.enum';

@InputType()
export class CreateStateInput {
  @Field(() => String)
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  extension?: string

  @IsInt()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  population?: number

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String)
  @IsString()
  region: ValidRegions

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  created_at: Date | string = new Date()

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  updated_at: Date | string = new Date()
}
