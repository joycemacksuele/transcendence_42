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
import {Controller, Req, Post, Get, HttpStatus, HttpException, Body, Logger, Delete, Param, HttpCode} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { DuplicateService } from 'src/duplicate/duplicate.service';
import { ChangeProfileNameDTO } from 'src/user/change_profile_image_or_name/change_profile_name.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from './user.entity';

interface CheckResponse {
	exists: boolean;
	user?: UserEntity; // Assuming 'User' is a defined type or interface for user data
}

@Controller('users')// the name must correspond to the path in frontend function get in userList
export class UserController {

	private readonly logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly duplicateService: DuplicateService,
    	private readonly authService: AuthService   // added jaka, to enable extractUserdataFromToken()
		// public readonly userRepository: UserRepository // jaka: Controller should not interact with UserRepository
	) {
		this.logger.log('constructor');
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


	@Get('check_if_user_in_db')
  // async checkIfCurrUserIsInDB(@Query('loginName') loginName: string) {
    async checkIfCurrUserIsInDB(@Req() request: Request): Promise<CheckResponse> {
    try {
      // get user and loginName from request-token
      let payload = await this.authService.extractUserdataFromToken(request);
      console.log("      ... payload.username: ", payload.username);


      // Check if user with the same loginName already exists
      console.log('Endpoint: Check_if_user_in_db()');
      const existingUser = await this.userService.getUserByLoginName(payload.username);
      if (existingUser) {
        console.log('CHECK: This loginName already exists in databs, LoginName:', existingUser.loginName);
        return { exists: true, user: existingUser};
        // return { message: 'This loginName already exists in database == the current user.'};
      }
      console.log('Endpoint: Check_if_user_in_db, LoginName:', existingUser); // jaka, temp
      
      return { exists: false }; 
      // return { message: 'CHECK User does not exist in the database.' };
    } catch (error) {
      console.error('Error...', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('change_profile_name')
  async changeProfileName(@Req() request: Request, @Body() data: ChangeProfileNameDTO): Promise<{ message: string }> {
    try {
      console.log('Changing the profile name:, new profileName: ', data.profileName);

      // get user and loginName from request-token
      let payload = await this.authService.extractUserdataFromToken(request);
      console.log("      ... payload.username: ", payload.username);


      const user = await this.userService.getUserByLoginName(payload.username);
      // console.log('Jaka, found profile name: ', user.profileName  );
      if (!user) {
	      throw new HttpException('User with this loginName not found', HttpStatus.I_AM_A_TEAPOT);
        // return {message: 'User with this loginName not found'};
      }
      const profile = await this.userService.getUserByProfileName(data.profileName);
      if (profile) {
	      throw new HttpException('User with this profileName already exists', HttpStatus.I_AM_A_TEAPOT);
        // return {message: 'User with this profileName already exists'};
      }

      const duplicate = await this.duplicateService.checkDuplicate(data.profileName, payload.username);
      if (duplicate) {
	      throw new HttpException('Another user with this profileName exists in Intra', HttpStatus.I_AM_A_TEAPOT);
        // return {message: 'Another user with this profileName exists in Intra'};
      }

      user.profileName = data.profileName; // updating the name
      await this.userService.saveUser(user);

      return {message: 'Profile name updated successfully.'};
    } catch (error) {
        console.error('Error updating the profile name: ', error.message);
        throw error;
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

