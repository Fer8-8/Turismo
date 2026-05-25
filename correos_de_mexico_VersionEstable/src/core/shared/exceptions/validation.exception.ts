import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

// lanzada cuando validación de input falla
export class AppValidationException extends AppException {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    const message = 'Error de validación';
    super(message, 'VALIDATION_ERROR', HttpStatus.BAD_REQUEST);
    this.errors = errors;
  }
}
