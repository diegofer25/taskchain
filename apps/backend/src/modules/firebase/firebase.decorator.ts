import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Inject the whole Firebase DecodedIdToken (default) or
 * a single property (e.g. @FirebaseUser('uid')).
 *
 * Throws 401 if the guard didn't populate req.user.
 */
export const FirebaseUser = createParamDecorator(
  (data: keyof DecodedIdToken | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user: DecodedIdToken }>();
    const user: DecodedIdToken | undefined = req.user;

    if (!user) {
      throw new UnauthorizedException('No authenticated user on request');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? user[data] : user;
  },
);
