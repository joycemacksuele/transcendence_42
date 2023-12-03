import {Logger, Module} from '@nestjs/common';
import { ChatController } from "./chat.controller";
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from "./chat.repository";
import { NewChatEntity } from './entities/new-chat.entity';
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { TwoFactorAuthService } from "src/auth/2fa/2fa.service";

@Module({
  imports: [TypeOrmModule.forFeature([NewChatEntity, ChatMessageEntity, UserEntity, ChatRepository]), UserModule],
  providers: [ChatService, ChatGateway, UserService, ChatRepository, AuthService, JwtService, TwoFactorAuthService],
  controllers: [ChatController],
  // Providers can include services or repositories (and as we won't have a controller for the chat,
  // we can add the chat gateway (for websockets) here too
})
export class ChatModule {
  private readonly logger = new Logger(ChatModule.name);
  constructor() {
    this.logger.log('constructor');
  }
}