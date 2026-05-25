import { IsString, MinLength } from 'class-validator';

export class ResetPasswordInput {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Nueva contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}
