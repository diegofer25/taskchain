import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    return {
      message: 'TaskChain API is running',
      version: '0.1.0',
    };
  }
}
