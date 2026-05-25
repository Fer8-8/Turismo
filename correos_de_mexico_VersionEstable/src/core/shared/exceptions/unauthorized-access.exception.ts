import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

// lanzada cuando usuario no tiene acceso al recurso
export class UnauthorizedAccessException extends AppException {
  constructor(message?: string) {
    super(
      message ?? 'No tienes acceso a este recurso',
      'UNAUTHORIZED_ACCESS',
      HttpStatus.FORBIDDEN,
    );
  }
}
