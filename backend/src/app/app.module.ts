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

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from "../user/user.module";
import { UserController } from "../user/user.controller";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";
import { UserEntity } from "../user/user.entity";
import { Friendship } from "../friendships/friendship.entity";
import { FriendshipModule } from "../friendships/friendship.module";
import { Blockship } from "src/blockShips/blockship.entity";
import { BlockshipModule } from "src/blockShips/blockship.module";

import { DataSource } from "typeorm";

import { DuplicateService } from '../duplicate/duplicate.service';

import { ChatModule } from "../chat/chat.module";
// import { ChatGateway } from "../chat/chat.gateway";
// import { ChatService } from '../chat/chat.service';
import { ChatMutedRepository } from "../chat/chat.repository";
import { ChatRepository } from "../chat/chat.repository";
import { ChatMessageEntity } from "src/chat/entities/chat-message.entity";
import { MutedEntity } from "../chat/entities/muted.entity";
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
      port: parseInt(process.env.POSTGRES_PORT, 10),
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        UserEntity,
        Friendship,
        MutedEntity,
        Blockship,
        NewChatEntity,
        ChatMessageEntity,
        MatchEntity,
      ],
      synchronize: true, // WARNING -> Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
      logging: ["query"],
    }),

    TypeOrmModule.forFeature([UserEntity]), // it is already in user.module -> DELETE FROM HERE?
    UserModule,
    ChatModule,
    TwoFactorAuthModule,
    MailerModule,
    FriendshipModule,
    BlockshipModule,
    MatchModule,
    PonggameModule,
  ],

  controllers: [
    AppController,
    UserController,
    TwoFactorAuthController,
    AuthController,
    DummyUsersController, // jaka, testing
    UploadImageController,
    // GetUserNameFromIntra, // jaka, testing
  ],

  providers: [
    AppService,
    UserService,
    UserRepository, //https://stackoverflow.com/questions/72680359/nestjs-entitymetadatanotfounderror-no-metadata-for-repository-was-found
    ChatMutedRepository,
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
