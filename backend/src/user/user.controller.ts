/* 
	This file contains the controller logic for handling user-related HTTP requests.

	This file needs to be imported to the corresponding module (ie: app.module.ts), so that there it enables the routing and request handling.
*/

import {Controller, Post, Get, Body, Logger, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { myUser } from './user.entity';
import * as Console from "console";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {
    Console.log('LOG UserController constructor');

  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    Console.log('LOG createUser');
    this.logger.log('Jaka: received user data:', JSON.stringify(createUserDto));
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<myUser[]> {
    return (this.userService.getAllUsers());
  }
}
