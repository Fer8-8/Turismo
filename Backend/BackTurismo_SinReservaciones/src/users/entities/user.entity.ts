import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';
import { Payment } from 'src/payment/entities/payment.entity';
import { Language } from 'src/languages/entities/language.entity';
import { Currency } from 'src/currencies/entities/currency.entity';
import { Userfeaturescache } from 'src/userfeaturescache/entities/userfeaturescache.entity';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => Role, { nullable: true })
  role?: Role | null;

  @Field(() => String, { nullable: true })
  managedStateId?: string | null;

  @Field(() => Boolean, { nullable: true })
  emailVerified: boolean;

  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];

  @Field(() => ID, { nullable: true })
  id_language?: string | null;

  @Field(() => Language, { nullable: true })
  languages?: Language;

  @Field(() => ID, { nullable: true })
  id_currency?: string | null;

  @Field(() => Currency, { nullable: true })
  currencies?: Currency;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Userfeaturescache, { nullable: true })
  userFeaturesCache?: Userfeaturescache | null;
}
