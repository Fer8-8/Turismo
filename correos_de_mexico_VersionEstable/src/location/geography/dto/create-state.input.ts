import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateGeoStateInput {
  @Field()
  @IsString()
  @Length(1, 255)
  name: string;

  @Field()
  @IsString()
  @Length(1, 10)
  abbr: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  country_id?: string;
}
