import { IsString, MinLength } from 'class-validator';

export class ChangePasswordInput {
  @IsString()
  @MinLength(8, { message: 'Contraseña actual debe tener al menos 8 caracteres' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Nueva contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}
