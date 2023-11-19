import {Logger, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { NewChatEntity } from './entities/new-chat.entity';
import {ChatController} from "./chat.controller";

@Module({
  imports: [TypeOrmModule.forFeature([NewChatEntity])],
  providers: [ChatService, ChatGateway],
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
