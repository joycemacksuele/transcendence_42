import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

// Websockets tips:
//      Websocket allow the browser sessions to be asynchronous (i.e.: 2 or more users and see the data in real time - no refreshing needed)
//      Each socket room should have its own entity/table so we can have data persistency since when the socket is closed, the data is lost.

@WebSocketGateway({cors: {origin: '*'}})//!DEV
// something like ????:
// cors: {
//   origin: process.env.BACKEND,
//   methods: ["GET", "POST"],
//   allowedHeaders: ["instant-chat-header"],
//   credentials: true,
// }
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
  createRoom(@MessageBody() createChatDto: CreateChatDto) {
    {/* TODO: roomType IS ALWAYS BEING SET TO Q ON THE BACKEND */}
    this.logger.log('[BACKEND LOG] ChatGateway -> createRoom called', createChatDto);
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
