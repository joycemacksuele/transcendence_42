import {Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(private configService: ConfigService) {
    this.logger.log('constructor');
  }

  getHello(): string {
    this.logger.log('getHello AppService');
    return '[BACKEND] Hello World!';
  }


  // Jaka: to get values from the .env file
  getIntraToken(): string {
    this.logger.log('Current access token from .env: ', this.configService.get<string>('TOKEN'));
    return this.configService.get<string>('TOKEN');
  }
}
