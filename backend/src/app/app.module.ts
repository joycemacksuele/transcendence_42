/*
  This is the main file for the core of the AppModule.
  Here you can import other modules.
  Path must match, but it can be without .ts suffix
*/

// jaka, todo: here apparently it is enough to only import the module of each entity (ie: UserModule), and not UserController etc ...
// --> remove the unnecessary

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from '../database/database.module';
import { DatabaseController } from '../database/database.controller';

import { UserModule } from '../user/user.module';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { FriendshipModule } from '../friendships/friendship.module';
import { Friendship } from '../friendships/friendship.entity';

import { DuplicateService } from '../duplicate/duplicate.service';

import { ChatModule } from '../chat/chat.module';
import { ChatService } from '../chat/chat.service';

import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { TwoFactorAuthController } from 'src/auth/2fa/2fa.controller';
import { TwoFactorAuthService } from 'src/auth/2fa/2fa.service';
import { TwoFactorAuthModule } from 'src/auth/2fa/2fa.module';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { DummyUsersController } from 'src/tests/dummyUsers/dummyUsers.controller';
import { StoreCurrUserToDataBs } from 'src/tests/test_intra42_jaka/manage_user_name.controller';
import { UploadImageController } from 'src/tests/test_intra42_jaka/change_profile_image';

// To read: https://docs.nestjs.com/techniques/database
/*
  TypeOrm
  TypeOrm is an Object Relational Mapper (ORM) typescript package that allows you to use both SQL
  such as PostgreSQL, MySQL and NoSQL databases. More about typeorm is in its documentation.
*/

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
      // load: [config],
    }),
    TypeOrmModule.forRoot({
      // Database configuration
      type: 'postgres',
      host: 'postgres_db', // Replace with the appropriate hostname if needed
      port: 5432,
      username: 'transcendence_user',
      password: '***REMOVED***',
      database: 'mydb',
      entities: [UserEntity, Friendship],// Add NewChatEntity (and others) here?????????
      synchronize: true,// WARNING -> Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
      // logging: ["query", "error", "schema", "warn", "info", "log", "migration"] // added jaka: trying to debug issue with the table 'Friendship'
    }),
    TypeOrmModule.forFeature([UserEntity]), // it is already in user.module
    UserModule,
    DatabaseModule,
    MailerModule,
    TwoFactorAuthModule,
    ChatModule,
    FriendshipModule
    //ChatModule,
  ],

  controllers: [
      AppController,
      UserController,
      DatabaseController,
      AuthController,
      // GetUserNameFromIntra, // jaka, testing
      DummyUsersController, // jaka, testing
      StoreCurrUserToDataBs,
      UploadImageController,
      TwoFactorAuthController,
  ],
                
  providers: [
      AppService,
      UserService,
      DuplicateService,
      UserRepository,//https://stackoverflow.com/questions/72680359/nestjs-entitymetadatanotfounderror-no-metadata-for-repository-was-found
      ChatService,
      AuthService,
      JwtService,
      TwoFactorAuthService,
  ],
})
export class AppModule {
    constructor() {
        console.log('[BACKEND LOG] AppModule constructor');
    }
}
