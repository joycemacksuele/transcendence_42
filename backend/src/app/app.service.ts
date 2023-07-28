import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    console.log('[BACKEND LOG] AppService constructor');
  }

  getHello(): string {
    console.log('[BACKEND LOG] getHello AppService');
    return '[BACKEND] Hello World!';
  }
}
