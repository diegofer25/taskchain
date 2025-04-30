import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSubService } from 'src/modules/pubsub/pubsub.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PUBSUB_CLIENT',
      useFactory: (configService: ConfigService) =>
        new WebPubSubServiceClient(
          configService.get<string>('AZURE_PUBSUB_CONNECTION_STRING') || '',
          'taskchain',
        ),
      inject: [ConfigService],
    },
    PubSubService,
  ],
  exports: [PubSubService],
})
export class PubsubModule {}
