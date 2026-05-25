import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

/**
 * CdmUser — Entidad de usuario de negocio.
 * Corresponde a la tabla cdm_users (entidad operativa del sistema).
 * No confundir con User (tabla Better Auth, identidad técnica).
 */
@ObjectType()
export class CdmUser {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  login?: string | null;

  @Field(() => Int, { defaultValue: 0 })
  sign_in_count: number;

  @Field(() => Int, { defaultValue: 0 })
  failed_attempts: number;

  @Field(() => String, { nullable: true })
  ship_address_id?: string | null;

  @Field(() => String, { nullable: true })
  bill_address_id?: string | null;

  @Field(() => Date, { nullable: true })
  last_request_at?: Date | null;

  @Field(() => Date, { nullable: true })
  current_sign_in_at?: Date | null;

  @Field(() => Date, { nullable: true })
  last_sign_in_at?: Date | null;

  @Field(() => String, { nullable: true })
  current_sign_in_ip?: string | null;

  @Field(() => String, { nullable: true })
  last_sign_in_ip?: string | null;

  @Field(() => Date, { nullable: true })
  locked_at?: Date | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
