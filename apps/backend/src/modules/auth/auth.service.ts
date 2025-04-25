import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { HttpService } from '@nestjs/axios';
import {
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

  /** Generate SAS for Web PubSub */
  async getPubSubSas(uid: string) {
    const { url, token } = await this.pubSub.getClientAccessToken({
      userId: uid,
      roles: ['webpubsub.joinLeaveGroup'],
      expirationTimeInMinutes: 1440, // 24h
    });

    return { url, token };
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
