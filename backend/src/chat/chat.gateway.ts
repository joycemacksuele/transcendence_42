import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {Logger, UnauthorizedException, UsePipes, ValidationPipe} from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestNewChatDto } from './dto/request-new-chat.dto';
import { RequestMessageChatDto } from './dto/request-message-chat.dto';
import { RequestRegisterChatDto } from './dto/request-register-chat.dto';
import {NewChatEntity} from "./entities/new-chat.entity";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {IsStrongPassword} from "class-validator";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from '@nestjs/jwt';

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

  constructor(
	private readonly chatService: ChatService,
	public readonly authService : AuthService
) {
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
      const token = clientSocket.handshake.headers.cookie.split('=')[1];
      this.logger.log('token: ', token);
      this.logger.log('token: ', token);
      try {
          const payload = await this.authService.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
          clientSocket.data.user = payload.username;
      } catch {
            throw new UnauthorizedException('Invalid token');
      }
    } catch {
      this.logger.log('UnauthorizedException -> Socket disconnected:', clientSocket.id);
      clientSocket.emit('error', new UnauthorizedException());
      // clientSocket.disconnect();
    }
  }

  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`Client disconnected: ${clientSocket.id}`);
    // Do we need to handle it since it's being disconnected from the frontend to get here?
    // client.disconnect();
  }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() requestNewChatDto: RequestNewChatDto, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('createChat -> requestNewChatDto: ', requestNewChatDto);
    this.logger.log('createChat -> clientSocket.id: ' + clientSocket.id);

    this.chatService.createChat(requestNewChatDto, clientSocket.data.user).then(() => {
      // If we could save a new chat in the database, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('getChats -> all chats were emitted to the frontend');
      });

    });
    // clientSocket.join(requestNewChatDto.chatName);// loginName + friendnName for DMs (OBS no repetition for groups)
    // this.logger.log('Socket rooms for the createChat: ' + clientSocket.rooms);
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(@MessageBody() chatId: number, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('deleteChat -> clientSocket.id: ' + clientSocket.id);

    this.chatService.deleteChat(chatId).then( () => {
      this.logger.log('deleteChat -> chatId: ' + chatId);
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
      @MessageBody('intraName') intraName: string,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('joinChat -> chatId: ' + chatId + " intraName: " + intraName);
    return await this.chatService.joinChat(chatId, chatPassword, intraName);
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
    // this.ws_server.emit.to(requestNewChatDto.loginName).('message', ret);
  }

  @SubscribeMessage('registerChat')
  registerChat(@MessageBody() requestRegisterChatDto: RequestRegisterChatDto) {
    this.logger.log('registerChat -> requestRegisterChatDto: ', requestRegisterChatDto);
    // const ret = this.chatService.messageChat(requestMessageChatDto);
    // this.ws_server.emit('new_chat', ret);
    // return ret; if needed
  }
}
