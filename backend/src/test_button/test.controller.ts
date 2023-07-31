import {Controller, Post, Get, Body, Logger, Delete, Param, HttpCode} from '@nestjs/common';
import {AppService} from "../app/app.service";
import { CreateUserDto } from '../user/create-user.dto';

@Controller()
export class TestButton {
  constructor() {
    console.log('[BACKEND LOG] Test Button constructor');
  }

  @Get('test')
  getExample(): string {
    return '[BACKEND] This is the response from "TEST" endpoint.';
  }

}
