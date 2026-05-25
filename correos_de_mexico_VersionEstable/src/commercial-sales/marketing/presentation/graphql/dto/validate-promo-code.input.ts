import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ValidatePromoCodeInput {
  @Field()
  @IsString()
  code: string;
}
