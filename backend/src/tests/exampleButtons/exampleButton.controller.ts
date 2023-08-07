import { Controller, Get } from '@nestjs/common';

@Controller()
export class ExampleButton {
  constructor() {
    console.log('[BACKEND LOG] ExampleButton constructor');
  }
  @Get('/exampleButton')
  getExample(): string {
    return '[BACKEND] This is the response from "exampleButton" Nest endpoint.';
  }
}
