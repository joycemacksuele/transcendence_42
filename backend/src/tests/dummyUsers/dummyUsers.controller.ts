// src/controllers/test.controller.ts
import { Controller, Post, HttpStatus, HttpException } from '@nestjs/common';
// import { DummyUserService } from './dummyUsers.service';
import { UserService } from '../../user/user.service';
import { MyUser } from '../../user/user.entity';
import { OpenAccess } from 'src/auth/guards/auth.openaccess';

// export class DummyUserDto {
//   intraName: string;
//   profileName: string;
//   // Add any other properties related to user insertion as needed
// }


@OpenAccess()
@Controller('insert-dummy-users')
export class DummyUsersController {
	// InsertUserDto class defined inside the TestController file
	constructor(private readonly userService: UserService) {
    	// Inject DummyUserService, responsible for interacting with the database
  	}


  @OpenAccess()
  @Post()
  async insertDummyUsers(): Promise<{ message: string }> {
    try {
      // Jaka: such endpoint should be protected and can only be accessed by authorized users

      // Dummy user data (for testing)
      const dummyUsers: MyUser[] = [
        { loginName: 'dummy 1', profileName: 'default name 1', intraId: 1, hashedSecret: 'hashedSecret1', email: 'email@email.com', tfaEnabled: true, tfaCode: 'default'},
        { loginName: 'dummy 2', profileName: 'default name 2', intraId: 2, hashedSecret: 'hashedSecret2', email: 'email@email.com', tfaEnabled: true, tfaCode: 'default'},
        { loginName: 'dummy 3', profileName: 'default name 3', intraId: 3, hashedSecret: 'hashedSecret3', email: 'email@email.com', tfaEnabled: true, tfaCode: 'default'},
        { loginName: 'dummy 4', profileName: 'default name 4', intraId: 4, hashedSecret: 'hashedSecret4', email: 'email@email.com', tfaEnabled: true, tfaCode: 'default'},
        { loginName: 'dummy 5', profileName: 'default name 5', intraId: 5, hashedSecret: 'hashedSecret5', email: 'email@email.com', tfaEnabled: true, tfaCode: 'default'},
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
