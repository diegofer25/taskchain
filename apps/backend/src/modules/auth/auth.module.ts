import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { PubsubModule } from 'src/modules/pubsub/pubsub.module';

@Global()
@Module({
  imports: [FirebaseModule, PubsubModule, HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
