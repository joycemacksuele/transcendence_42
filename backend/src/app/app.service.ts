import { Injectable } from '@nestjs/common';
import Console from "console";

@Injectable()
export class AppService {
  constructor() {
    Console.log('[LOG] AppService constructor');
  }

  getHello(): string {
    Console.log('[LOG] getHello AppService');
    return 'Hello World!';
  }
}
