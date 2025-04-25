import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { JobStatusDto } from '@taskchain/types';
import { PUBSUB_CLIENT } from 'src/modules/pubsub/pubsub.module';

@Injectable()
export class AgentsService {
  constructor(@Inject(PUBSUB_CLIENT) private pubSub: WebPubSubServiceClient) {}

  async notifyJobProgress(userId: string, payload: JobStatusDto) {
    await this.pubSub.sendToUser(userId, JSON.stringify(payload));
  }
}
