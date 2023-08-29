/*
  This is the main file for the core of the AppModule.
  Here you can import other modules.
  Path must match, but it can be without .ts suffix
*/

/*
  TypeOrm
  TypeOrm is an Object Relational Mapper (ORM) typescript package that allows you to use both SQL
  such as PostgreSQL, MySQL and NoSQL databases. More about typeorm is in its documentation.
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from '../database/database.module';
import { DatabaseController } from '../database/database.controller';

import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MyUser } from '../user/user.entity';

import { ExampleController } from '../tests/exampleButtons/example.controller';
import { ExampleButton } from '../tests/exampleButtons/exampleButton.controller';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { TestButton } from 'src/tests/exampleButtons/test.controller';

// added jaka to test API INTRA42
import { GetUserNameFromIntra } from '../tests/test_intra42_jaka/fetchFromIntra_userName.controller';
// import { DummyUserService } from 'src/tests/dummyUsers/dummyUsers.service';
import { DummyUsersController } from 'src/tests/dummyUsers/dummyUsers.controller';
// added jaka: to enable using .env 
import { AppConfigModule } from '../config/config.module'; /* the Module containing ConfigService */
// added jaka: to store current user to database
import { StoreCurrUserToDataBs } from 'src/tests/test_intra42_jaka/manage_user_name.controller';
import { UploadImageController } from 'src/tests/test_intra42_jaka/change_profile_image';
import { JwtService } from '@nestjs/jwt';
// import { NestExpressApplication } from '@nestjs/platform-express'; // jaka, to enable sending response in body
// import * as cors from 'cors'; // jaka, to enable sending response in body

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      // Database configuration
      type: 'postgres',
      host: 'postgres_db', // Replace with the appropriate hostname if needed
      port: 5432,
      username: 'transcendence_user',
      password: 'novogeslo1',
      database: 'mydb',
      entities: [MyUser],
      synchronize: true,
    }),
    
    TypeOrmModule.forFeature([MyUser]),
    DatabaseModule,
    AppConfigModule // added jaka: to enable .env to be visible globally
  ],

  controllers: [
      AppController,
      UserController,
      DatabaseController,
      UserController,
      AuthController,
      TestButton,
      ExampleController,    // jaka, testing
      ExampleButton,        // jaka, testing
      GetUserNameFromIntra,          // jaka, testing
      DummyUsersController,  // jaka, testing
      StoreCurrUserToDataBs,
      UploadImageController,
  ],
                
  providers: [
      AppService,
      UserService,
      UserRepository,//https://stackoverflow.com/questions/72680359/nestjs-entitymetadatanotfounderror-no-metadata-for-repository-was-found
      AuthService,
      JwtService
  ],
})
export class AppModule {
    constructor() {
        console.log('[BACKEND LOG] AppModule constructor');
    }
}
