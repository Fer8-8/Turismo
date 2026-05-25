import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserAddressSummaryType {
  @Field(() => ID)
  id: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  address1: string;

  @Field(() => String, { nullable: true })
  address2?: string | null;

  @Field()
  city: string;

  @Field()
  zipcode: string;

  @Field()
  phone: string;

  @Field(() => String, { nullable: true })
  state_name?: string | null;

  @Field(() => String, { nullable: true })
  company?: string | null;

  @Field(() => String, { nullable: true })
  label?: string | null;

  @Field()
  state_id: string;

  @Field(() => String, { nullable: true })
  country_id?: string | null;
}
