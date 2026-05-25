import { ObjectType, Field, ID } from '@nestjs/graphql';
import { State } from '../../state/entities/state.entity';
import { Country } from '../../state/entities/country.entity';

// direccion postal envio o facturacion
@ObjectType()
export class Address {
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
  alternative_phone?: string | null;

  @Field(() => String, { nullable: true })
  company?: string | null;

  // nombre estado desnormalizado referencia
  @Field(() => String, { nullable: true })
  state_name?: string | null;

  @Field(() => ID)
  state_id: string;

  // estado resuelto dinamicamente graphql
  @Field(() => State, { nullable: true })
  state?: State;

  @Field(() => ID, { nullable: true })
  country_id?: string | null;

  // pais resuelto dinamicamente graphql
  @Field(() => Country, { nullable: true })
  country?: Country;

  @Field(() => ID, { nullable: true })
  user_id?: string | null;

  @Field(() => String, { nullable: true })
  label?: string | null;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

