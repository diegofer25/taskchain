import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    return {
      message: 'Hello from NestJS!',
    };
  }
}
