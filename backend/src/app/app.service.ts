import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) {
    console.log('[BACKEND LOG] AppService constructor');
  }

  getHello(): string {
    console.log('[BACKEND LOG] getHello AppService');
    return '[BACKEND] Hello World!';
  }


  // Jaka: to get values from the .env file
  getIntraToken(): string {
    return this.configService.get<string>('TOKEN');
  }
}
