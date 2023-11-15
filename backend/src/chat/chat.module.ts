import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { NewChatEntity } from './entities/new-chat.entity';
import {ChatRepository} from "./chat.repository";

@Module({
  imports: [TypeOrmModule.forFeature([NewChatEntity])],
  providers: [ChatService, ChatGateway, ChatRepository],
  // Providers can include services or repositories (and as we won't have a controller for the chat,
  // we can add the chat gateway (for websockets) here too
})
export class ChatModule {
  constructor() {
    console.log('Constructor');
  }
}
