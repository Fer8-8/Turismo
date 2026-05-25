import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateZoneInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  default_tax?: boolean;

  @Field({ nullable: true, defaultValue: 'state' })
  @IsString()
  @IsOptional()
  kind?: string;
}
