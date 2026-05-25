import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TaxCategory } from './tax-category.entity';
import { TaxZone } from './zone.entity';

@ObjectType()
export class TaxRate {
  @Field(() => ID)
  id: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => ID, { nullable: true })
  zone_id?: string;

  @Field(() => TaxZone, { nullable: true })
  zone?: TaxZone;

  @Field(() => ID, { nullable: true })
  tax_category_id?: string;

  @Field(() => TaxCategory, { nullable: true })
  taxCategory?: TaxCategory;

  @Field()
  included_in_price: boolean;

  @Field()
  show_rate_in_label: boolean;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
