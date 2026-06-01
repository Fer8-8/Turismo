import { Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterUserInput } from './dto/register-user.input';

@Injectable()
export class AuthResService {
  create(registerUserInput: RegisterUserInput) {
    return 'This action adds a new authRe';
  }

  findAll() {
    return `This action returns all authRes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authRe`;
  }

  update(id: number, registerUserInput: RegisterUserInput) {
    return `This action updates a #${id} authRe`;
  }

  remove(id: number) {
    return `This action removes a #${id} authRe`;
  }
}

