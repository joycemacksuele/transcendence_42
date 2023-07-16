import { Controller, Get } from '@nestjs/common';

@Controller()
export class ExampleButton {
  constructor() {
    console.log('[LOG] ExampleButton constructor');
  }
  @Get('/exampleButton')
  getExample(): string {
    return 'This is the response from "exampleButton" Nest endpoint.';
  }
}
