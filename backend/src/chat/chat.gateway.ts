import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger, UnauthorizedException, UsePipes, ValidationPipe} from '@nestjs/common';
import {ChatService} from './chat.service';
import {RequestNewChatDto} from './dto/request-new-chat.dto';
import {RequestMessageChatDto} from './dto/request-message-chat.dto';
import {RequestRegisterChatDto} from './dto/request-register-chat.dto';
import {AuthService} from "src/auth/auth.service";
import {ChatType} from "./utils/chat-utils";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";

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
    implements OnGatewayConnection, OnGatewayDisconnect
    // implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
      private readonly chatService: ChatService,
      public readonly authService : AuthService
  ) {
    this.logger.log('Constructor');
  }

  @WebSocketServer()
  ws_server: Server;

  // afterInit() {
  //   this.logger.log('Initialized');
  // }

  async handleConnection(clientSocket: Socket) {
    try {
      this.logger.log('[handleConnection] Socket connected: ' + clientSocket.id);

      let token = null;
      // this.logger.log('[handleConnection] header: ', clientSocket.handshake.headers);
      // this.logger.log('[handleConnection] cookie: ', clientSocket.handshake.headers.cookie);
      if (clientSocket.handshake.headers.cookie) {
        const token_index_start = clientSocket.handshake.headers.cookie.indexOf("token");
        const token_key_value = clientSocket.handshake.headers.cookie.substring(token_index_start);
        // this.logger.log('[handleConnection] token_key_value: ' + token_key_value);

        if (token_key_value.includes(";")) {
          const token_index_end = token_key_value.indexOf(";");
          const token_key_value_2 = token_key_value.substring(0, token_index_end);
          token = token_key_value_2.split('=')[1];
        } else {
          token = token_key_value.split('=')[1];
        }
        this.logger.log('[handleConnection] token: ' + token);
      }
      try {
        const payload = await this.authService.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
        this.logger.log('[handleConnection] payload.username: ' + payload.username);
        clientSocket.data.user = payload.username;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      this.logger.log('[handleConnection] ' + error);
      clientSocket.emit('error', new UnauthorizedException());
      clientSocket.disconnect();
    }
  }

  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`[handleDisconnect] Socket disconnected: ${clientSocket.id}`);
  }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() requestNewChatDto: RequestNewChatDto, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('createChat -> clientSocket.id: ' + clientSocket.id);
    this.logger.log('createChat -> clientSocket.data.user: ' + clientSocket.data.user);
    this.logger.log('createChat -> requestNewChatDto: ', requestNewChatDto);

    this.chatService.createChat(requestNewChatDto, clientSocket.data.user).then(() => {
      this.logger.log('getChats -> chat' + requestNewChatDto.name + 'was created');
      // If we could save a new chat in the database, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);// todo emit to everyone -> use ws_socket?
        this.logger.log('getChats -> all chats were emitted to the frontend');
      });

    });

    // Join the specific room after chat was created
    if (requestNewChatDto.type == ChatType.PRIVATE) {
      // chat name for private chat  = friend's name
      clientSocket.join(clientSocket.data.user + requestNewChatDto.name);
      this.logger.log('Socket has joined room ' + clientSocket.data.user + requestNewChatDto.name);
    } else {
      clientSocket.join(requestNewChatDto.name);// TODO no repetition for groups names since wit would join the same room
      this.logger.log('Socket has joined room ' + requestNewChatDto.name);
    }
    this.logger.log('Socket rooms for the createChat: ', clientSocket.rooms.size);
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(@MessageBody() chatId: number, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('deleteChat -> clientSocket.id: ' + clientSocket.id);

    this.chatService.deleteChat(chatId).then( () => {
      this.logger.log('deleteChat -> chat'+ chatId + 'was deleted');
      // If we could delete the chat from the database, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('joinChat')
  async joinChat(
      @MessageBody('chatId') chatId: number,
      @MessageBody('chatPassword') chatPassword: string,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('joinChat -> chatId: ' + chatId + " clientSocket.data.user: " + clientSocket.data.user);
    return await this.chatService.joinChat(chatId, chatPassword, clientSocket.data.user);
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(
      @MessageBody('chatId') chatId: number,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('leaveChat -> chatId: ' + chatId + " clientSocket.data.user: " + clientSocket.data.user);
    return await this.chatService.leaveChat(chatId, clientSocket.data.user);
  }

  @SubscribeMessage('getChats')
  async getChats(@ConnectedSocket() clientSocket: Socket) {
    this.logger.log('getChats -> clientSocket.id: ' + clientSocket.id);

    this.chatService.getAllChats().then( (allChats) => {
      // If we could get the whole table from the database, emit it to the frontend
      clientSocket.emit("getChats", allChats);
      this.logger.log('getChats -> all chats were emitted to the frontend');
    });
  }

  @SubscribeMessage('messageChat')
  messageChat(@MessageBody() requestMessageChatDto: RequestMessageChatDto) {
    this.logger.log('messageChat -> requestMessageChatDto: ', requestMessageChatDto);
    // const ret = this.chatService.messageChat(requestMessageChatDto);
    // A message was received and saved into the database, so we can emit it to everyone on the specific socket room
    // this.ws_server.emit.to(clientSocket.data.user).('message', ret);
  }

  @SubscribeMessage('registerChat')
  registerChat(@MessageBody() requestRegisterChatDto: RequestRegisterChatDto) {
    this.logger.log('registerChat -> requestRegisterChatDto: ', requestRegisterChatDto);
    // const ret = this.chatService.messageChat(requestMessageChatDto);
    // this.ws_server.emit('new_chat', ret);
    // return ret; if needed
  }
}
