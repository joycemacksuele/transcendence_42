/* 
		This file is called a 'Controller', for the entity 'user'
	It contains logic for handling the incoming HTTP requests of the entity 'user'

		Each method in this file needs a corresponding method in the files:
			- user.service.ts (to interact with the database)
			- user.repository.ts (to handle data operations)

		@Get()  @Post() ... are called 'route decorators'
		For example, the method getAllUsers() is 'decorater with a @Get()'
		When a GET method comes to the route 'users', then the method getAllUsers() is automatically called
		
		The class is exported, and then this file needs to be imported to the corresponding module
		(ie: app.module.ts), so that there, it enables the routing and request handling.

		Promises are used to handle operations that may take a longer time to complete.

		PROMISES
		------------------------------------
		When working with asynchronous functions, Promises are used to handle operations that may take a
		longer time to complete.

		The Promise<UserEntity[]> is used to handle the result of an asynchronous function getAllUsers().
		This function will fetch a collection of User objects from a database.

		A Promise<UserEntity[]> allows the function to start retrieving the users asynchronously.
		The Promise object represents the eventual completion of retreiving.
		The Promise will become an array of User objects.

		The code that calls getAllUsers() can then handle the Promise using methods like .then() or await to
		access the resolved value (the array of User objects) when it becomes available.
		This way, the code can continue executing other tasks while waiting for the asynchronous operation
		to complete, improving the overall efficiency and responsiveness of the application.
*/

// import { UserRepository } from './user.repository' ;
import {Controller, Post, Get, Body, Logger, Delete, Param, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from './user.entity';

@Controller('users')// the name must correspond to the path in frontend function get in userList
export class UserController {

	private readonly logger = new Logger(UserController.name);

	constructor(private readonly userService: UserService,
		// public readonly userRepository: UserRepository // jaka: Controller should not interact with UserRepository
	) {
		this.logger.log('[BACKEND LOG] UserController constructor');
	}

	@Post()
	async createUser(@Body() createUserDto: CreateUserDto) {
		this.logger.log('[BACKEND LOG] createUser');
		this.logger.log('[BACKEND LOG] Received user data:', JSON.stringify(createUserDto));
		return this.userService.createUser(createUserDto);// UserEntity
	}


    // GET ALL USERS
    @Get('all')
    async getAllUsers(): Promise<UserEntity[]> {
        this.logger.log('[BACKEND LOG] getAllUsers');
        return (this.userService.getAllUsers());
    }
	
	
	// GET ONE USER DATA BY LOGIN NAME
	@Get('get-user/:loginName')
	async getUserData(
		@Param('loginName') loginName: string
	): Promise<UserEntity>
	{
		this.logger.log('[BACKEND LOG] getUser');
		return (this.userService.getUserByLoginName(loginName));
	}

	// GET ONE USER DATA BY LOGIN NAME
	@Get('get-user-by-profilename/:profileName')
	async getUserDataByProfileName(
		@Param('profileName') profileName: string
	): Promise<UserEntity>
	{	
		this.logger.log('[BACKEND LOG] getUser');
		return (this.userService.getUserByProfileName(profileName));
	}

	// DELETE DUMMIES
	@Delete()
	async deleteDummies(): Promise<void> {
		console.log('DELETE All Dummies');
		try {
			await this.userService.deleteDummies();
			this.logger.log('[BACKEND LOG] from nest user.controller: All dummies deleted.');
		} catch (error) {
			this.logger.error('[BACKEND LOG] from nest user.controller: Error deleting dummies.', error);
		}
	}

	// @Post('delete-dummies')
	// async deleteDummies(): Promise<void> {
	//   return this.userService.deleteDummies();
	// }

	//////////////////////////////////////////////////////////////////////////
	// UserRepository ///////////////////////////////////////////////////////
	
	// GET USER BY ID
	// :id  is a route parameter, matching the request /users/:id
	// It needs the @Param decorator to be able to pass the arg to the function getUserById( id )'
	// @Get(':id')
	// async findById(@Param('id') id: number): Promise<UserEntity | undefined> {
	//   this.logger.log('[BACKEND LOG] findById');
	//   return this.userService.getUserById(id);
	// }


}

