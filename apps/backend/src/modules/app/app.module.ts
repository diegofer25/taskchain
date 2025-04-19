import { AzureAiModule } from '@x2d/azure-ai-nest';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    AzureAiModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const connectionString = config.get<string>('AZURE_AI_PROJECTS_CONNECTION_STRING');

        if (!connectionString) {
          throw new Error('AZURE_AI_PROJECTS_CONNECTION_STRING is not defined');
        }

        return {
          connectionString,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
