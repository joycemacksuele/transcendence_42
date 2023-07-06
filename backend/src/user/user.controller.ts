/* 
	This file contains the controller logic for handling user-related HTTP requests.

	This file needs to be imported to the corresponding module (ie: app.module.ts), so that there it enables the routing and request handling.
*/

import {Controller, Post, Get, Body, Logger, Delete, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { myUser } from './user.entity';
import * as Console from "console";

@Controller('users')    // the name must correspond to the path in frontend function get in userList
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
    Console.log('LOG getAllUsers');
    return (this.userService.getAllUsers());
  }

  @Delete()
  async deleteAllUsers(): Promise<void> {
    try {
      await this.userService.deleteAllUsers();
      console.log('LOG from nest user.controller: All users deleted.');
    } catch (error) {
      console.error('LOG from nest user.controller: Error deleting all users.', error);
    }
  }
  
}
