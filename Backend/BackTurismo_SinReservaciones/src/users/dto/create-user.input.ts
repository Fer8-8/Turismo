import { InputType, Field, ID } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field({ nullable: true })
  managedStateId?: string;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id_language?: string;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id_currency?: string;
}
