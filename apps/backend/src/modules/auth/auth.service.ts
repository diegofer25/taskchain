import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PUBSUB_CLIENT } from 'src/modules/pubsub/pubsub.module';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PUBSUB_CLIENT) private readonly pubSub: WebPubSubServiceClient,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAuthPubsub(isForce: boolean, userId: string) {
    if (await this.pubSub.userExists(userId)) {
      if (isForce) {
        await Promise.all([
          this.pubSub.closeUserConnections(userId, { reason: 'force' }),
          this.pubSub.removeUserFromAllGroups(userId),
        ]);
      } else {
        throw new ConflictException('already_connected');
      }
    }

    return this.generateClientSignedUrl(userId);
  }

  private async generateClientSignedUrl(userId: string) {
    return this.pubSub
      .getClientAccessToken({
        expirationTimeInMinutes: 60 * 24,
        userId,
        roles: ['webpubsub.joinLeaveGroup'],
      })
      .then(({ url, token }) => ({ url, token }));
  }

  async getAzureTtsToken() {
    const region = this.configService.get<string>('AZURE_SPEECH_REGION');
    if (!region) {
      throw new InternalServerErrorException('AZURE_SPEECH_REGION is not set');
    }
    const { data } = await this.httpService.axiosRef.post<string>(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key':
            this.configService.get<string>('AZURE_SPEECH_KEY'),
        },
      },
    );

    return { token: data, region };
  }
}
