import { Controller, Get } from '@nestjs/common';
import {AppService} from "./app/app.service";

@Controller()
export class ExampleController {
  constructor() {
    console.log('[LOG] ExampleController constructor');
  }

  @Get('/example')
  getExample(): string {
    return 'This is the response from "example" endpoint.';
  }
}
