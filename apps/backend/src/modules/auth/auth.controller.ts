import { Controller, Get, ParseBoolPipe, Query } from '@nestjs/common';
import { AuthPubSubResponse, SpeechToken } from '@taskchain/types';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthService } from 'src/modules/auth/auth.service';
import { FirebaseUser } from 'src/modules/firebase/firebase.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('pubsub')
  async authPubSub(
    @FirebaseUser() user: DecodedIdToken,
    @Query('force', ParseBoolPipe) force: boolean,
  ): Promise<AuthPubSubResponse> {
    return this.service.getAuthPubsub(force, user.uid);
  }

  @Get('speech')
  getAzureTtsToken(): Promise<SpeechToken> {
    return this.service.getAzureTtsToken();
  }
}
