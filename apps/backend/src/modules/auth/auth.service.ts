import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpeechToken } from '@taskchain/types';
import { PubSubService } from 'src/modules/pubsub/pubsub.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAuthPubsub(isForce: boolean, userId: string) {
    if (await this.pubSubService.userExists(userId)) {
      if (isForce) {
        await this.pubSubService.forceDisconnect(userId);
      } else {
        throw new ConflictException('already_connected');
      }
    }

    return this.pubSubService.generateClientSignedUrl(userId);
  }

  async getAzureTtsToken(): Promise<SpeechToken> {
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
