/* 
    This file is called a 'Controller', for the entity 'user'
	  It contains logic for handling the incoming HTTP requests of the entity 'user'

    Each method in this file needs a corresponding method in the files:  user.service.ts (to interact with the database)
            user.repository.ts (to handle data operations)

    @Get()  @Post() ... are called 'route decorators'
    For example, the method getAllUsers() is 'decorater with a @Get()'
    When a GET method comes to the route 'users', then the method getAllUsers() is automatically called
    
    The class is exported, and then this file needs to be imported to the corresponding module (ie: app.module.ts), so that there it enables the routing and request handling.

    Promises are used to handle operations that may take a longer time to complete.

    PROMISES
    When working with asynchronous functions, Promises are used to handle operations that may take a longer time to complete.

    The Promise<myUser[]> is used to handle the result of an asynchronous function getAllUsers(). This function will fetch a collection of myUser objects from a database.

    A Promise<myUser[]> allows the function to start retrieving the users asynchronously. The Promise object represents the eventual completion of retreiving. The Promise will become an array of myUser objects.

    The code that calls getAllUsers() can then handle the Promise using methods like .then() or await to access the resolved value (the array of myUser objects) when it becomes available. This way, the code can continue executing other tasks while waiting for the asynchronous operation to complete, improving the overall efficiency and responsiveness of the application.
*/

import {Controller, Post, Get, Body, Logger, Delete, Param, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { myUser } from './user.entity';


@Controller('users')    // the name must correspond to the path in frontend function get in userList
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    console.log('LOG UserController constructor');
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('LOG createUser');
    this.logger.log('LOG Jaka: received user data:', JSON.stringify(createUserDto));
    return this.userService.createUser(createUserDto);
  }
  
  @Get()
  async getAllUsers(): Promise<myUser[]> {
    console.log('LOG getAllUsers');
    return (this.userService.getAllUsers());
  }


  // GET USER BY ID
  // :id  is a route parameter, matching the request /users/:id
  // It needs the @Param decorator to be able to pass the arg to the function getUserById( id )'
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<myUser> {
    console.log('LOG getUserById');
    return this.userService.getUserById(id);
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
