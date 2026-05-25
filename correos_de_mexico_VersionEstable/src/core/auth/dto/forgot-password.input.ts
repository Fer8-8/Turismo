import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordInput {
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @IsString()
  redirectUrl: string;
}
