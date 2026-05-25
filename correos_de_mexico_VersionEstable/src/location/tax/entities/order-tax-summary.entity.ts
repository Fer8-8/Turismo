import { ObjectType, Field, Float } from '@nestjs/graphql';
import { TaxCalculationResult } from './tax-calculation-result.entity';

/** Resultado consolidado del cálculo fiscal de una orden completa. */
@ObjectType()
export class OrderTaxSummary {
  @Field(() => Float)
  additional_tax_total: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  line_items_tax: number;

  @Field(() => Float)
  shipment_tax: number;

  @Field(() => [TaxCalculationResult])
  breakdown: TaxCalculationResult[];
}
