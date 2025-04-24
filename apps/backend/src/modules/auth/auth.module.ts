import { Global, Module } from '@nestjs/common';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { webPubSubProvide } from 'src/modules/pubsub/pubsub.provider';

@Global()
@Module({
  imports: [FirebaseModule],
  controllers: [AuthController],
  providers: [webPubSubProvide, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
