import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

// lanzada cuando header x-store-id falta o es vacío
export class MissingStoreIdException extends AppException {
  constructor() {
    super(
      'Se requiere el header X-Store-Id',
      'MISSING_STORE_ID',
      HttpStatus.BAD_REQUEST,
    );
  }
}
