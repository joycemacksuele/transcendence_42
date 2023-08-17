import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/*
  To use the controller in typescript, you need to use the nest controller decorator @Controller()
  followed by its associated class, you can also add an optional route path to a controller,
  for example@Controller(‘users’)  .
*/
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('[BACKEND LOG] AppController constructor');
  }

  @Get('/')
  getHello(): string {
    console.log('[BACKEND LOG] getHello AppController');
    return this.appService.getHello();
  }
}
