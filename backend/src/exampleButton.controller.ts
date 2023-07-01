import { Controller, Get } from '@nestjs/common';
import Console from "console";

@Controller()
export class ExampleButton {
  constructor() {
    Console.log('LOG ExampleButton constructor');
  }
  @Get('/exampleButton')
  getExample(): string {
    return 'This is the response from "exampleButton" Nest endpoint.';
  }
}
