import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCurrencyInput {
  @Field( () => String)
  name: string
  
  @Field( () => String)
  abbr: string
}
