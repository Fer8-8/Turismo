import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Tarjeta de crédito enmascarada.
 * NUNCA se expone el número completo, solo últimos 4 dígitos y tipo.
 */
@ObjectType()
export class UserCreditCardSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  cc_type?: string | null;

  @Field(() => String, { nullable: true })
  last_digits?: string | null;

  @Field(() => String, { nullable: true })
  month?: string | null;

  @Field(() => String, { nullable: true })
  year?: string | null;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field()
  created_at: Date;
}
