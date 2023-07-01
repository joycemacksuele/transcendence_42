import { Controller, Get } from '@nestjs/common';
import {AppService} from "./app/app.service";
import Console from "console";

@Controller()
export class ExampleController {
  constructor() {
    Console.log('LOG ExampleController constructor');
  }
  @Get('/example')
  getExample(): string {
    return 'This is the response from "example" endpoint.';
  }
}
