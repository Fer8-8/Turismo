import { ObjectType, Field, Float } from '@nestjs/graphql';

/** Resultado del cálculo fiscal de una línea, envío u orden. */
@ObjectType()
export class TaxCalculationResult {
  @Field(() => Float)
  additional_tax: number;

  @Field(() => Float)
  included_tax: number;

  @Field(() => Float)
  taxable_amount: number;

  @Field(() => String, { nullable: true })
  rate_name?: string;

  @Field(() => Float)
  rate_amount: number;

  @Field()
  included_in_price: boolean;
}
