import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Store {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field()
  is_active: boolean;

  @Field(() => String, { nullable: true })
  default_currency?: string;

  @Field(() => String, { nullable: true })
  default_locale?: string;

  @Field(() => String, { nullable: true })
  customer_support_email?: string;

  @Field(() => String, { nullable: true })
  new_order_notifications_email?: string;

  @Field(() => String, { nullable: true })
  mail_from_address?: string;

  @Field(() => String, { nullable: true })
  default_country_id?: string;

  @Field(() => String, { nullable: true })
  checkout_zone_id?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  contact_phone?: string;

  @Field(() => String, { nullable: true })
  meta_description?: string;

  @Field(() => String, { nullable: true })
  meta_keywords?: string;

  @Field(() => String, { nullable: true })
  seo_title?: string;

  @Field(() => String, { nullable: true })
  seo_robots?: string;

  @Field(() => String, { nullable: true })
  facebook?: string;

  @Field(() => String, { nullable: true })
  twitter?: string;

  @Field(() => String, { nullable: true })
  instagram?: string;

  @Field(() => String, { nullable: true })
  supported_currencies?: string;

  @Field(() => String, { nullable: true })
  supported_locales?: string;

  @Field()
  default: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
