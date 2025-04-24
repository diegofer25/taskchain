import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';
export const FIREBASE_AUTH = 'FIREBASE_AUTH';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useFactory: (cfg: ConfigService): App => {
        if (getApps().length) return getApps()[0];

        return initializeApp({
          credential: cert({
            projectId: cfg.get<string>('FB_PROJECT_ID'),
            clientEmail: cfg.get<string>('FB_CLIENT_EMAIL'),
            privateKey: cfg
              .get<string>('FB_PRIVATE_KEY')
              ?.replace(/\\n/g, '\n'),
          }),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: FIREBASE_AUTH,
      useFactory: (app: App) => getAuth(app),
      inject: [FIREBASE_ADMIN],
    },
  ],
  exports: [FIREBASE_AUTH, FIREBASE_ADMIN],
})
export class FirebaseModule {}
