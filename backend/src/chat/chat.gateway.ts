import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {Logger, UnauthorizedException, UsePipes, ValidationPipe} from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestNewChatDto } from './dto/request-new-chat.dto';
import { RequestMessageChatDto } from './dto/request-message-chat.dto';
// import { RequestRegisterChatDto } from './dto/request-register-chat.dto';

/*
    Websockets tips:
    Websocket allows the browser sessions to be asynchronous.
    i.e.: 2 or more users and see the data in real time - no refreshing needed.

    Each socket room should have its own entity/table, so we can have data persistence since when the socket is
    closed, the data is lost.
 */

@UsePipes(new ValidationPipe())// As the global one does not work for web sockets
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
    this.logger.log('Constructor');
  }

  @WebSocketServer()
  ws_server: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(clientSocket: Socket) {
    try {
      this.logger.log('Socket connected: ' + clientSocket.id);

      clientSocket.on("connected", (socket) => {
        this.logger.log('Socket rooms: ' + socket.rooms);
        socket.join("newChat");
        this.logger.log('Socket rooms: ' + socket.rooms);
      })
      // const token = clientSocket.handshake.headers.cookie.split('=')[1];
      // this.logger.log('token: ', token);
      // const decodedToken = this.authService.validateJwt(token);
      // const user = await this.authService.validateUser(decodedToken.id);
      // clientSocket.data.user = user;
    } catch {
      this.logger.log('UnauthorizedException -> Socket disconnected:', clientSocket.id);
      clientSocket.emit('error', new UnauthorizedException());
      // clientSocket.disconnect();
    }
  }

  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`Client disconnected: ${clientSocket.id}`);
    // Do we need to handle it?
    // client.disconnect();
  }

  @SubscribeMessage('createChat')
  // createChat(@MessageBody() requestNewChatDto: RequestNewChatDto) {
  createChat(@MessageBody() requestNewChatDto: RequestNewChatDto, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('createChat -> requestNewChatDto: ', requestNewChatDto);
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.chatService.createChat(requestNewChatDto).then();
    // clientSocket.join(requestNewChatDto.loginName);// + loginName of other person -> for groups ??
    // this.logger.log('Socket rooms for the createChat: ' + clientSocket.rooms);
  }

  @SubscribeMessage('messageChat')
  messageChat(@MessageBody() requestMessageChatDto: RequestMessageChatDto) {
    this.logger.log('messageChat -> requestMessageChatDto: ', requestMessageChatDto);
    // const ret = this.chatService.messageChat(requestMessageChatDto);
    // A message was received and saved into the database, so we can emit it to everyone on the specific socket room
    // this.ws_server.emit.to(requestNewChatDto.loginName).('message', ret);
  }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   this.logger.log('findAllChat called');
  //   return this.chatService.findAll();
  // }
  //
  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   this.logger.log('findOneChat called');
  //   return this.chatService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   this.logger.log('updateChat called');
  //   // return this.chatService.update(updateChatDto.id, updateChatDto);
  //   return this.chatService.update(updateChatDto.id);
  // }
  //
  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   this.logger.log('removeChat called');
  //   return this.chatService.remove(id);
  // }
}
