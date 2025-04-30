import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { PubSubEvent } from '@taskchain/types';

@Injectable()
export class PubSubService {
  constructor(
    @Inject('PUBSUB_CLIENT') private readonly client: WebPubSubServiceClient,
  ) {}

  async publish<T extends PubSubEvent>(uid: string, event: T) {
    await this.client.sendToUser(uid, JSON.stringify(event));
  }

  async userExists(userId: string) {
    return this.client.userExists(userId);
  }

  async forceDisconnect(userId: string) {
    return Promise.all([
      this.client.closeUserConnections(userId, { reason: 'force' }),
      this.client.removeUserFromAllGroups(userId),
    ]);
  }

  async generateClientSignedUrl(userId: string) {
    return this.client
      .getClientAccessToken({
        expirationTimeInMinutes: 60 * 24,
        userId,
        roles: ['webpubsub.joinLeaveGroup'],
      })
      .then(({ url, token }) => ({ url, token }));
  }
}
