import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password for the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Field(() => String, { description: 'Name of the user', nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null;
  @Field(() => String, { description: 'Role of the user', nullable: true })
  @IsOptional()
  @IsString()
  role?: string | null;
}
