import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestNewChatDto } from './dto/request-new-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

/*
    Websockets tips:
    Websocket allows the browser sessions to be asynchronous.
    i.e.: 2 or more users and see the data in real time - no refreshing needed.

    Each socket room should have its own entity/table, so we can have data persistence since when the socket is
    closed, the data is lost.
 */

@WebSocketGateway({
  // namespace: '/chat',
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
    //methods: ["GET", "POST"],
    //allowedHeaders: ["instant-chat-header"],
  }})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {
    this.logger.log('[BACKEND LOG] ChatGateway constructor');
  }

  @WebSocketServer()
  ws_server: Server;

  afterInit() {
    this.logger.log('[BACKEND LOG] ChatGateway Initialized');
  }

  async handleConnection(clientSocket: Socket) {
    try {
      this.logger.log('[BACKEND LOG] ChatGateway Client Socket connected: ', clientSocket.id);
      // const token = clientSocket.handshake.headers.cookie.split('=')[1];
      // this.logger.log('[BACKEND LOG] ChatGateway token: ', token);
      // const decodedToken = this.authService.validateJwt(token);
      // const user = await this.authService.validateUser(decodedToken.id);
      // clientSocket.data.user = user;
    } catch {
      this.logger.log('[BACKEND LOG] Client disconnected:', clientSocket.id);
      clientSocket.emit('error', new UnauthorizedException());
      // clientSocket.disconnect();
    }
  }

  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`[BACKEND LOG] Client disconnected: ${clientSocket.id}`);
    // Do we need to handle it?
    // client.disconnect();
  }

  @SubscribeMessage('createRoom')
  // createRoom(@MessageBody() createChatDto: RequestNewChatDto, @ConnectedSocket() clientSocket: Socket) {
  createRoom(@MessageBody() createChatDto: RequestNewChatDto) {
    this.logger.log('[BACKEND LOG] ChatGateway -> createRoom called: ', createChatDto);
    return this.chatService.createRoom(createChatDto);
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
