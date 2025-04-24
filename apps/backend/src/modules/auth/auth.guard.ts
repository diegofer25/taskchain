import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
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
