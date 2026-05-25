import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SignUpInput } from '../dto/sign-up.input';
import { SignInInput } from '../dto/sign-in.input';
import { AuthResponse } from '../types/auth-response.type';
import { UnauthorizedException, BadRequestException, UseGuards } from '@nestjs/common';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { User } from '../../user/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthService } from '../auth.service';

@Resolver()
export class AuthResolver {

  constructor(private authService: AuthService) {}

  @AllowAnonymous()
  @Mutation(() => AuthResponse)
  async register(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.register(signUpInput);
  }

  @AllowAnonymous()
  @Mutation(() => AuthResponse)
  async login(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signin(signInInput);
  }

  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}