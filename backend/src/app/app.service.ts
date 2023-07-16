import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    console.log('[LOG] AppService constructor');
  }

  getHello(): string {
    console.log('[LOG] getHello AppService');
    return 'Hello World!';
  }
}
