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
    console.log('Current access token from .env: ', this.configService.get<string>('TOKEN'));
    return this.configService.get<string>('TOKEN');
  }
}
