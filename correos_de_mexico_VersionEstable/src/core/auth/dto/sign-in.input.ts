import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
  password: string;
}
