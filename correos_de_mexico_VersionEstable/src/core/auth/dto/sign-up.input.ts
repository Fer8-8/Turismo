import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
  @MaxLength(128, { message: 'Contraseña no puede exceder 128 caracteres' })
  password: string;

  @Field(() => String)
  @IsString()
  @MinLength(2, { message: 'Nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Nombre no puede exceder 100 caracteres' })
  name: string;
}
