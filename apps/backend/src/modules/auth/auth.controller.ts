import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('pubsub')
  async authPubSub(
    @Headers('authorization') authHeader?: string,
    @Body('idToken') idTokenBody?: string,
  ) {
    // Prioriza Bearer header; fallback para body
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : idTokenBody;

    if (!token) {
      throw new BadRequestException('Missing Auth token');
    }

    return this.service.getPubSubSas(token);
  }
}
