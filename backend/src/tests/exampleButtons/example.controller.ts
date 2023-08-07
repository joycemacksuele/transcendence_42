import {Controller, Post, Get, Body, Logger, Delete, Param, HttpCode} from '@nestjs/common';
import {AppService} from "../../app/app.service";
import { CreateUserDto } from '../../user/create-user.dto';



@Controller()
export class ExampleController {
  constructor() {
    console.log('[BACKEND LOG] ExampleController constructor');
  }
  @Get('/example')
  getExample(): string {
    console.log('test print example in local terminal');
    return '[BACKEND] This is the response from "example" endpoint.';
  }

  @Post('/chat')
  async getChat(@Body() createUserDto: CreateUserDto) {// TODO using CreateUserDto just for now
    console.log('[BACKEND LOG] getChat');
    console.log('[BACKEND LOG] Received user data:', JSON.stringify(createUserDto));
    return '[BACKEND] This is the response from "chat" endpoint.';
  }
}
