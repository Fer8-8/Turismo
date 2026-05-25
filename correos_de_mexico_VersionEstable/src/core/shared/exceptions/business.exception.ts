import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

// lanzada cuando regla negocio no se cumple
export class BusinessException extends AppException {
  constructor(message: string, code?: string) {
    super(message, code ?? 'BUSINESS_RULE_VIOLATION', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
