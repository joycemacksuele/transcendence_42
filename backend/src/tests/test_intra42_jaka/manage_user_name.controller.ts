// src/controllers/test.controller.ts
import { Controller, Post, Get, HttpStatus, HttpException, Body, Query } from '@nestjs/common';
// import { DummyUserService } from './dummyUsers.service';
import { UserService } from '../../user/user.service';
import { MyUser } from '../../user/user.entity';



@Controller('manage_curr_user_data')
export class StoreCurrUserToDataBs {
	// InsertUserDto class defined inside the TestController file
	constructor(private readonly userService: UserService) {
  }




  @Get('check_if_user_in_db')
  async checkIfCurrUserIsInBB(@Query('loginName') loginName: string) {
    try {
      // Check if user with the same loginName already exists
      const existingUser = await this.userService.getUserByLoginName(loginName);
      if (existingUser) {
        console.log('CHECK: This loginName already exists in databs, LoginName:', existingUser.loginName);
        return { exists: true, user: existingUser};
        // throw new HttpException('This loginName already exists in database --> the current user.', HttpStatus.CONFLICT);
        // return { message: 'This loginName already exists in database == the current user.'};
        // FOUND EXISTING USER IN DB, NOT SURE IF THIS IS THE OPTIMAL WAY TO CHECK
      }
      return { exists: false }; 
      // return { message: 'CHECK User does not exist in the database.' };
    } catch (error) {
      console.error('Error...', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



////////////////////////////


  @Post('store_login_data')
  async storeCurrUserName(@Body() data: { loginName: string,
                                          profilename: string,
                                          loginImage: string,
                                          profileImage: string,
                                          intraId: number,
                                          email: string,
                                          tfaEnabled: boolean,
                                          tfaCode: string,
                                          hashedSecret: string }): Promise<{ message: string }> {
    try {
      // Check if user with the same loginName already exists
      const existingUser = await this.userService.getUserByLoginName(data.loginName );
      if (existingUser) {
        // console.log('This loginName already exists in databs -> the current user, profilefame:', existingUser.profileName);
        return { message: 'STORE: This loginName already exists in database == the current user.'};
        // FOUND EXISTING USER IN DB, NOT SURE IF THIS IS THE OPTIMAL WAY TO CHECK
        // throw new HttpException('This loginName already exists in database --> the current user.', HttpStatus.CONFLICT);
      }
      const currUserName: MyUser[] = [
        { loginName: data.loginName,
          profileName: data.loginName,
          profileImage: data.loginImage,
          intraId: 0,                             // todo jaka: change back, and obtain the real intraId
          email: data.email,
          tfaEnabled: false,
          tfaCode: 'default',
          hashedSecret: 'dummy hashed secret' },  // todo jaka: change back, and obtain the real hashedSecret
          // intraId: data.intraId,
          // hashedSecret: data.hashedSecret },
      ];

      const promises = currUserName.map((user) => this.userService.createUser(user));
      await Promise.all(promises);

      return { message: 'STORE: Current user name stored successfully.' };
    } catch (error) {
      console.error('STORE: Error storing current user name:', error);
      throw new HttpException('STORE: Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Post('change_profile_name')
  async changeProfileName(@Body() data: { profileName: string, loginName: string }): Promise<{ message: string }> {
    try {
      // Get the profile name of the Current User!
      // TODO jaka, how the current user profilename is hardcoded, it needs to be available somewhere, maybe as global var
      
      // should be get current UserByLoginName() and then change the profile name, but then the profile name on the button should be also replaced,
      // but that button name is loaded in the Header, directly from intra ...!


      const user = await this.userService.getUserByLoginName(data.loginName);
      // console.log('Jaka, found profile name: ', user.profileName  );
      if (!user) {
        return {message: 'User with this profileName not found'};
      }

      user.profileName = data.profileName; // updating the name
      await this.userService.saveUser(user);

      return {message: 'Profile name updated successfully.'};
    } catch (error) {
      console.error('Error updating the profile name: ', error.message);
      throw error;
    }
  }


} // End Class


// needs to check if this loginName already exists before storing it.
// Must create a separate function in the user.service

