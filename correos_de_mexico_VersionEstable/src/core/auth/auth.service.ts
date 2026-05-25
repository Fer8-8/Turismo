import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SignUpInput } from './dto/sign-up.input';
import { auth } from '../../lib/auth';
import { BadRequestException } from '@nestjs/common';
import { AuthResponse } from './types';
import { SignInInput } from './dto/sign-in.input';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(signUpInput: SignUpInput): Promise<AuthResponse>{
    try {
          const result = await auth.api.signUpEmail({
            body: {
              email: signUpInput.email,
              password: signUpInput.password,
              name: signUpInput.name,
            },
          });
    
          if (!result) {
            throw new BadRequestException('Registration failed');
          }
    
          const anyResult = result as any;
          return {
            user: anyResult.user,
            token: anyResult.token || anyResult.session?.token || '',
          };
        } catch (error) {
          throw new BadRequestException(error.message);
        }
  }

  async signin(signInInput: SignInInput): Promise<AuthResponse> {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email: signInInput.email,
          password: signInInput.password,
        },
      });

      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const anyResult = result as any;
      return {
        user: anyResult.user,
        token: anyResult.token || anyResult.session?.token || '',
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  
}