import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const PUBSUB_CLIENT = 'PUBSUB_CLIENT';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUBSUB_CLIENT,
      useFactory: (configService: ConfigService) =>
        new WebPubSubServiceClient(
          configService.get<string>('AZURE_PUBSUB_CONNECTION_STRING') || '',
          'taskchain',
        ),
      inject: [ConfigService],
    },
  ],
  exports: [PUBSUB_CLIENT],
})
export class PubsubModule {}
