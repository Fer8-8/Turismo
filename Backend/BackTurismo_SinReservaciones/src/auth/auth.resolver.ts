import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { auth } from '../lib/auth';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { AuthResponse } from './entities/auth-response.entity';
import { UnauthorizedException, BadRequestException, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  @AllowAnonymous()
  @Mutation(() => AuthResponse)
  async register(@Args('registerUserInput') registerUserInput: RegisterUserInput) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: registerUserInput.email,
          password: registerUserInput.password,
          name: registerUserInput.name,
          image: registerUserInput.image,
          // El rol por defecto es 'user' en Prisma, pero podemos forzarlo aquí si es necesario
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

  @AllowAnonymous()
  @Mutation(() => AuthResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email: loginUserInput.email,
          password: loginUserInput.password,
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
  @AllowAnonymous()
  @Mutation(() => AuthResponse)
  async loginAnonymously() {
    try{
      const result = await auth.api.signInAnonymous({
        headers: new Headers()
      });

      if (!result){
        throw new UnauthorizedException('Could not create anonymous session');
      }

      const anyResult = result as any;
      return {
        user: anyResult.user,
        token: anyResult.token || anyResult.session?.token || '',
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
