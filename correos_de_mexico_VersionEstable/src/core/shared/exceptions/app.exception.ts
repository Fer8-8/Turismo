import { HttpException, HttpStatus } from '@nestjs/common';

// clase base para excepciones custom
export class AppException extends HttpException {
  public readonly code: string;

  constructor(
    message: string,
    code: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ message, code }, status);
    this.code = code;
  }
}
