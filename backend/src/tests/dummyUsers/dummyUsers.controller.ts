// src/controllers/test.controller.ts
import { Controller, Post, HttpStatus, HttpException } from '@nestjs/common';
// import { DummyUserService } from './dummyUsers.service';
import { UserService } from '../../user/user.service';
import { MyUser } from '../../user/user.entity';

// export class DummyUserDto {
//   intraName: string;
//   profileName: string;
//   // Add any other properties related to user insertion as needed
// }


@Controller('insert-dummy-users')
export class DummyUsersController {
	// InsertUserDto class defined inside the TestController file
	constructor(private readonly userService: UserService) {
    	// Inject DummyUserService, responsible for interacting with the database
  	}



  @Post()
  async insertDummyUsers(): Promise<{ message: string }> {
    try {
      // Jaka: such endpoint should be protected and can only be accessed by authorized users

      // Dummy user data (for testing)
      const dummyUsers: MyUser[] = [
        { id: 0, name: 'intra dummy 1', profileName: 'default name 1', loginName: 'default'},
        { id: 1, name: 'intra dummy 2', profileName: 'default name 2', loginName: 'default' },
        { id: 2, name: 'intra dummy 3', profileName: 'default name 3', loginName: 'default' },
        { id: 3, name: 'intra dummy 4', profileName: 'default name 4', loginName: 'default' },
        { id: 4, name: 'intra dummy 5', profileName: 'default name 5', loginName: 'default' },

      ];

      // Insert the dummy users into the database
      // const promises = dummyUsers.map((user) => this.userService.createUser(user));
      const promises = dummyUsers.map((user) => this.userService.createUser(user));
      await Promise.all(promises);

      return { message: 'Dummy users inserted successfully.' };
    } catch (error) {
      console.error('Error inserting dummy users:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
