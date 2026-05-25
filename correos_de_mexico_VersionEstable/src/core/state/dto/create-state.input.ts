import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateStateInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  abbr: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  country_id?: string;
}
