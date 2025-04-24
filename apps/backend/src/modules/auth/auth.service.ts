import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { FIREBASE_AUTH } from 'src/modules/firebase/firebase.module';
import { PUBSUB_CLIENT } from 'src/modules/pubsub/pubsub.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(FIREBASE_AUTH) private readonly auth: Auth,
    @Inject(PUBSUB_CLIENT) private readonly pubSub: WebPubSubServiceClient,
  ) {}

  /** Validate Firebase token and generate SAS for Web PubSub */
  async getPubSubSas(idToken: string) {
    if (!idToken) throw new UnauthorizedException('Missing Firebase token');

    // 1. Verify Firebase token
    let decoded: DecodedIdToken;
    try {
      decoded = await this.auth.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const uid = decoded.uid; // user id

    // 3. Generate Web PubSub token with 24h expiration
    const { url, token } = await this.pubSub.getClientAccessToken({
      userId: uid,
      roles: ['webpubsub.joinLeaveGroup'],
      expirationTimeInMinutes: 1440, // 24h
    });

    return { url, token };
  }
}
