import {Controller, Get, Logger} from '@nestjs/common';
import { AppService } from './app.service';

/*
  To use the controller in typescript, you need to use the nest controller decorator @Controller()
  followed by its associated class, you can also add an optional route path to a controller,
  for example@Controller(‘users’)
*/
@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
    this.logger.log('constructor');
  }

  @Get('/')
  getHello(): string {
    this.logger.log('getHello');
    return this.appService.getHello();
  }
}
