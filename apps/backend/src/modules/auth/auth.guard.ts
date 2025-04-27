import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { SKIP_AUTH } from 'src/modules/auth/auth.decorators';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization ?? '';

    if (!header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const idToken = header.slice(7); // strip “Bearer ”
    try {
      /* Pass `true` as the 2nd arg to also reject revoked tokens */
      const decoded = await getAuth().verifyIdToken(idToken, true);
      req['user'] = decoded; // make it available to handlers
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
