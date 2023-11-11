import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { NewChatEntity } from './entities/new-chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewChatEntity]),
    // UserModule
  ],
  // Providers can include services or repositories (and as we won't have a controller for the chat,
  // we can add the chat gateway (for websockets) here too
  providers: [ChatService, ChatGateway],
})
export class ChatModule {
  constructor() {
    console.log('[BACKEND LOG] ChatModule constructor');
  }
}
