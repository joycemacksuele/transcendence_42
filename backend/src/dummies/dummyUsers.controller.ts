// src/controllers/test.controller.ts
import { Controller, Post, HttpStatus, HttpException } from '@nestjs/common';
// import { DummyUserService } from './dummyUsers.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
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

      // If Dummies already exists, return!
      let user = await this.userService.getUserByLoginName("dummy1");
      if (user) {
          console.log("Dummies already exists, no need to create new ones.");
          return { message: 'Returned: Dummies already exists, no need to create new ones.' };
      }
      // console.log("      ... user.email: ", user.email);

      // Jaka: such endpoint should be protected and can only be accessed by authorized users

      // Dummy user data (for testing)
      const dummyUsers: UserEntity[] = [
        { loginName: 'dummy1', profileName: 'dummy1', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 1, hashedSecret: 'hashedSecret1', email: 'email@email.com', onlineStatus: false, rank: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        { loginName: 'dummy2', profileName: 'dummy2', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 2, hashedSecret: 'hashedSecret2', email: 'email@email.com', onlineStatus: false, rank: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        { loginName: 'dummy3', profileName: 'dummy3', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 3, hashedSecret: 'hashedSecret3', email: 'email@email.com', onlineStatus: false, rank: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        { loginName: 'dummy4', profileName: 'dummy4', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 4, hashedSecret: 'hashedSecret4', email: 'email@email.com', onlineStatus: false, rank: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},
        
        { loginName: 'dummy5', profileName: 'dummy5', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 5, hashedSecret: 'hashedSecret5', email: 'email@email.com', onlineStatus: false, rank: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},


        // { loginName: 'dummy1', profileName: 'dummy1', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 1, hashedSecret: 'hashedSecret1', email: 'email@email.com', onlineStatus: false, rank: 7, gamesPlayed: 20, gamesWon: 11, gamesLost: 9, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        // { loginName: 'dummy2', profileName: 'dummy2', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 2, hashedSecret: 'hashedSecret2', email: 'email@email.com', onlineStatus: false, rank: 3, gamesPlayed: 21, gamesWon: 13, gamesLost: 8, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        // { loginName: 'dummy3', profileName: 'dummy3', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 3, hashedSecret: 'hashedSecret3', email: 'email@email.com', onlineStatus: false, rank: 9, gamesPlayed: 22, gamesWon: 15, gamesLost: 7, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        // { loginName: 'dummy4', profileName: 'dummy4', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 4, hashedSecret: 'hashedSecret4', email: 'email@email.com', onlineStatus: false, rank: 8, gamesPlayed: 22, gamesWon: 17, gamesLost: 5, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},

        // { loginName: 'dummy5', profileName: 'dummy5', profileImage: 'uploadsDummies/dummy_image.jpg', intraId: 5, hashedSecret: 'hashedSecret5', email: 'email@email.com', onlineStatus: false, rank: 2, gamesPlayed: 22, gamesWon: 19, gamesLost: 3, achievements: 'Lazy Lamb', tfaEnabled: true, tfaCode: 'default', isFirstLogin: true, refreshToken: 'default', friendships: [], chatMessages: null, roomsCreated: [], canChat: []},
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
