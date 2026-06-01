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
import { auth } from '../lib/auth';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { toNodeHandler } from "better-auth/node";

@Controller('api/auth')
export class AuthResController {
  @AllowAnonymous()
  @Post('register')
  async register(@Body() registerUserInput: RegisterUserInput) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: registerUserInput.email,
          password: registerUserInput.password,
          name: registerUserInput.name,
          image: registerUserInput.image,
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
  @Post('login')
  async login(@Body() loginUserInput: LoginUserInput) {
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


