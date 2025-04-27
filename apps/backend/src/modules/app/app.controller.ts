import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/modules/app/app.service';
import { Public } from 'src/modules/auth/auth.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHello() {
    return this.appService.getHello();
  }
}
