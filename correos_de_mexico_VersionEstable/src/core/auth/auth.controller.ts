import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  All,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from '../../lib/auth';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { CurrentUser } from './decorators/current-user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { toNodeHandler } from "better-auth/node";
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @AllowAnonymous()
  @Post('register')
  async register(@Body() signUpInput: SignUpInput) {
    return this.authService.register(signUpInput);
  }

  @AllowAnonymous()
  @Post('login')
  async login(@Body() signInInput: SignInInput) {
    return this.authService.signin(signInInput);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: UserEntity) {
    return user;
  }

  // @All('*')
  // async handleAuth(@Req() req: Request) {
  //   return auth.handler(req as any);
  // }

  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // toNodeHandler convierte la respuesta de Better-Auth 
    // al formato que Express/NestJS entienden perfectamente.

    // console.log("Método:", req.method);
    // console.log("Ruta recibida:", req.url);
    return toNodeHandler(auth)(req, res);
  }
}

