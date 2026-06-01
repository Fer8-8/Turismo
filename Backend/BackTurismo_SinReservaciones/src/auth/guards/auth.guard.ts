import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from 'src/lib/auth';
import { fromNodeHeaders } from "better-auth/node";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Validamos la sesión con Better-Auth
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedException('No tienes una sesión activa');
    }

    // Guardamos la sesión y el usuario en la petición 
    // para usarlo luego en el Controller o Resolver
    request.user = session.user;
    request.session = session.session;
    
    return true;
  }
}