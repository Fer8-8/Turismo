import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateLanguageInput {
  @IsString()
  @Field( () => String )
  name: string

  @IsString()
  @Field( () => String )
  abbr: string
}
