/*
  This is the main file for the core of the AppModule.
  Here you can import other modules.
  Path must match, but it can be without .ts suffix
*/

// jaka, todo: here apparently it is enough to only import the module of each entity (ie: UserModule), and not UserController etc ...
// --> remove the unnecessary

import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { DatabaseModule } from "../database/database.module";
import { DatabaseController } from "../database/database.controller";

import { UserModule } from "../user/user.module";
import { UserController } from "../user/user.controller";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";
import { UserEntity } from "../user/user.entity";
import { FriendshipModule } from "../friendships/friendship.module";
import { Friendship } from "../friendships/friendship.entity";

import { DataSource } from "typeorm";

import { DuplicateService } from '../duplicate/duplicate.service';

import { ChatModule } from "../chat/chat.module";
// import {ChatController} from "../chat/chat.controller";
// import { ChatGateway } from "../chat/chat.gateway";
// import { ChatService } from '../chat/chat.service';
import { ChatRepository } from "../chat/chat.repository";
import { ChatMessageEntity } from "src/chat/entities/chat-message.entity";
import { NewChatEntity } from "src/chat/entities/new-chat.entity";

import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { TwoFactorAuthController } from "src/auth/2fa/2fa.controller";
import { TwoFactorAuthService } from "src/auth/2fa/2fa.service";
import { TwoFactorAuthModule } from "src/auth/2fa/2fa.module";
import { JwtService } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";

import { DummyUsersController } from "src/dummies/dummyUsers.controller";
import { UploadImageController } from "src/user/change_profile_image_or_name/change_profile_image";
import { AddUsernameMiddleware } from "src/user/change_profile_image_or_name/change_profile_image";
import { MatchModule } from "src/matches/match.module";
import { MatchEntity } from "src/matches/match.entity";
import { NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common"; // jaka: needed for uploading images via diskStorage (Multer)
import { AuthMiddleware } from "src/auth/guards/auth.middleware";

import { PonggameModule } from "src/ponggame/ponggame.module";
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
      type: "postgres",
      host: "postgres_db", // Replace with the appropriate hostname if needed
      port: 5432,
      username: "transcendence_user",
      password: "***REMOVED***",
      database: "mydb",
      entities: [
        UserEntity,
        Friendship,
        NewChatEntity,
        ChatMessageEntity,
        MatchEntity,
      ],
      synchronize: true, // WARNING -> Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
      // logging: ["query", "error", "schema", "warn", "info", "log", "migration"] // added jaka: trying to debug issue with the table 'Friendship'
      logging: ["query"] // added Robert, for testing
    }),
    TypeOrmModule.forFeature([UserEntity]), // it is already in user.module -> DELETE FROM HERE?
    UserModule,
    ChatModule,
    TwoFactorAuthModule,
    DatabaseModule,
    MailerModule,
    FriendshipModule,
    MatchModule,
    PonggameModule,
  ],

  controllers: [
    AppController,
    UserController,
    TwoFactorAuthController,
    AuthController,
    DatabaseController,
    DummyUsersController, // jaka, testing
    UploadImageController,
    // GetUserNameFromIntra, // jaka, testing
  ],

  providers: [
    AppService,
    UserService,
    UserRepository, //https://stackoverflow.com/questions/72680359/nestjs-entitymetadatanotfounderror-no-metadata-for-repository-was-found
    // ChatGateway,// already on chat module
    // ChatService,// already on chat module
    ChatRepository,
    TwoFactorAuthService,
    AuthService,
    JwtService,
    DuplicateService,
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);
  constructor() {
    this.logger.log("constructor");
  }

  configure(consumer: MiddlewareConsumer) {
    // added jaka: needed for fetching username for uploading new profile image
    consumer.apply(AddUsernameMiddleware).forRoutes(UploadImageController);
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.ALL },
        { path: "auth/token", method: RequestMethod.ALL }
      )
      .forRoutes({ path: "/**", method: RequestMethod.ALL });
  }
}
