import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

// lanzada cuando recurso solicitado no existe
export class AppNotFoundException extends AppException {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} con id "${id}" no encontrado`
      : `${resource} no encontrado`;
    super(message, 'NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
