import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@WebSocketGateway({cors: {origin: '*'}})//!DEV
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {
    this.logger.log('[BACKEND LOG] ChatGateway constructor');
  }

  @WebSocketServer()
  server: Server;

  private socketId: number;

  @SubscribeMessage('createRoom')
  // createRoom(@MessageBody() createChatDto: CreateChatDto, @ConnectedSocket() clientSocket: Socket) {
  createRoom() {
    this.logger.log('[BACKEND LOG] ChatGateway -> createRoom called');
    // return this.chatService.createRoom(createChatDto);
    return this.chatService.createRoom();
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    this.logger.log('[BACKEND LOG] ChatGateway -> findAll called');
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    this.logger.log('[BACKEND LOG] ChatGateway -> findOne called');
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    this.logger.log('[BACKEND LOG] ChatGateway -> update called');
    // return this.chatService.update(updateChatDto.id, updateChatDto);
    return this.chatService.update(updateChatDto.id);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    this.logger.log('[BACKEND LOG] ChatGateway -> remove called');
    return this.chatService.remove(id);
  }
}
