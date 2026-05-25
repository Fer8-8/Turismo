import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

// lanzada cuando hay conflicto de datos o duplicados
export class AppConflictException extends AppException {
  constructor(message: string) {
    super(message, 'CONFLICT', HttpStatus.CONFLICT);
  }
}
