import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger, UnauthorizedException, UseFilters, UsePipes, ValidationPipe, ValidationError} from '@nestjs/common';
import {ChatService} from './chat.service';
import {ChatMessageEntity} from './entities/chat-message.entity';
import {NewChatEntity} from './entities/new-chat.entity';
import {ChatRepository} from './chat.repository';
import {RequestNewChatDto} from './dto/request-new-chat.dto';
import {ResponseMessageChatDto} from './dto/response-message-chat.dto';
import {RequestMessageChatDto} from './dto/request-message-chat.dto';
import {RequestRegisterChatDto} from './dto/request-register-chat.dto';
import {AuthService} from "src/auth/auth.service";
import {ChatType} from "./utils/chat-utils";
import {WsExceptionFilter} from "./utils/chat-exception-handler";

/*
    Websockets tips:
    Websocket allows the browser sessions to be asynchronous.
    i.e.: 2 or more users and see the data in real time - no refreshing needed.

    Each socket room should have its own entity/table, so we can have data persistence since when the socket is
    closed, the data is lost.
 */

@UseFilters(new WsExceptionFilter())
// @UsePipes(new ValidationPipe())// As the global one does not work for web sockets
@UsePipes(new ValidationPipe({
  exceptionFactory(validationErrors: ValidationError[] = []) {
    if (this.isDetailedOutputDisabled) {
      return new WsException('JOYCEs Bad request');
    }
    const errors = this.flattenValidationErrors(validationErrors);
    throw new WsException(errors.toString());
  }
}))
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
      private readonly chatRepository: ChatRepository,
      public readonly authService : AuthService
  ) {
    this.logger.log('Constructor');
  }

  @WebSocketServer()
  ws_server: Server;

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

  @SubscribeMessage('getChats')
  async getChats(@ConnectedSocket() clientSocket: Socket) {
    this.logger.log('getChats -> clientSocket.id: ' + clientSocket.id);

    try {
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('getChats -> all chats were emitted to the frontend');
      });
    } catch (err) {
      this.logger.log(err);
    }
  }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() requestNewChatDto: RequestNewChatDto, @ConnectedSocket() clientSocket: Socket) {
    try {
      this.logger.log('createChat -> clientSocket.id: ' + clientSocket.id);
      this.logger.log('createChat -> clientSocket.data.user: ' + clientSocket.data.user);
      this.logger.log('createChat -> requestNewChatDto: ', requestNewChatDto);

      this.chatService.createChat(requestNewChatDto, clientSocket.data.user).then((newChatEntity) => {

        // Join the specific room after chat was created
        // room name can be the chat id since they are unique
        clientSocket.join(newChatEntity.id.toString());
        this.logger.log('Socket has joined room ' + newChatEntity.id.toString());
        this.logger.log('Number of socket rooms: ' + clientSocket.rooms.size);

        // If we could save a new chat in the database, get the whole table
        this.logger.log('getChats -> chat ' + requestNewChatDto.name + ' was created');
        this.chatService.getAllChats().then((allChats) => {
          // If we could get the whole table from the database, emit it to the frontend
          clientSocket.emit("getChats", allChats);// todo emit to everyone -> use ws_socket?
          this.logger.log('createChat -> getChats -> all chats were emitted to the frontend');
        });
      }).catch((err) => {
        this.logger.log('createChat -> Could not create chat -> err: ' + err.message);
        clientSocket.emit("error", err.message);
      });
    } catch (err) {
      this.logger.log('createChat -> Could not create chat -> err: ' + err.message);
      throw err;
    }
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(@MessageBody() chatId: number, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('deleteChat -> clientSocket.id: ' + clientSocket.id);

    this.chatService.deleteChat(chatId).then( () => {
      this.logger.log('deleteChat -> chat '+ chatId + ' was deleted');
      // Since the chat was deleted we can remove all listeners from the specific socket room
      clientSocket.removeAllListeners(chatId.toString());
      this.logger.log('All listeners were removed from room ' + chatId.toString());

      // If we could delete the chat from the database, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('deleteChat -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('joinChat')
  async joinChat(
      @MessageBody('chatId') chatId: number,
      @MessageBody('chatPassword') chatPassword: string | null,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('joinChat -> chatId: ' + chatId + " clientSocket.data.user: " + clientSocket.data.user);
    await this.chatService.joinChat(chatId, chatPassword, clientSocket.data.user).then( () => {
      // Join the specific room after chat was created
      clientSocket.join(chatId.toString());
      this.logger.log('Socket has joined room ' + chatId.toString());

      // If we could join the chat, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('deleteChat -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(
      @MessageBody('chatId') chatId: number,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('leaveChat -> chatId: ' + chatId + " clientSocket.data.user: " + clientSocket.data.user);
    await this.chatService.leaveChat(chatId, clientSocket.data.user).then( () => {
      this.logger.log('leaveChat -> user ' + clientSocket.data.user + ' left chat ' + chatId);

      // Since the user left the chat, we can remove them from the specific socket room
      clientSocket.removeListener(chatId.toString(), () => {
        this.logger.log('leaveChat -> user ' + clientSocket.data.user + 'was removed from room ' + chatId.toString());
      });

      // If we could delete the chat from the database, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('leaveChat -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('addAdmin')
  async addAdmin(
      @MessageBody('chatId') chatId: number,
      @MessageBody('newAdmin') newAdmin: string,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('addAdmin -> chatId: ' + chatId + " newAdmin: " + newAdmin);
    await this.chatService.addAdmin(chatId, newAdmin).then( () => {
      // No need to join the specific room since an admin has once joined it already as a member of the chat

      // If we could join the chat, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("addAdmin", allChats);
        this.logger.log('addAdmin -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('muteFromChat')
  async muteFromChat(
      @MessageBody('chatId') chatId: number,
      @MessageBody('user') user: string,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('muteFromChat -> Muting member ' + user + " from chat " + chatId);
    // Mute will NOT delete the user from the chat BUT will add them to a mutedUsers list
    await this.chatService.muteFromChat(chatId, user).then( () => {
      // Muted user won't be removed from socket room since they can still see the messages from the chat
      // but other members can't see their messages

      // If we could mute user from the chat, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('muteFromChat -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('kickFromChat')
  async kickFromChat(
      @MessageBody('chatId') chatId: number,
      @MessageBody('user') user: string,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('kickFromChat -> Kicking member ' + user + " from chat " + chatId);
    // kick will only delete the user from the chat (no further consequences)
    await this.chatService.leaveChat(chatId, user).then( () => {
      // Since the user was kicked from the chat, we can remove them from the specific socket room
      clientSocket.removeListener(chatId.toString(), () => {
        this.logger.log('kickFromChat -> user ' + user + 'was removed from room ' + chatId.toString());
      });

      // If we could kick user from the chat, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('kickFromChat -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('banFromChat')
  async banFromChat(
      @MessageBody('chatId') chatId: number,
      @MessageBody('user') user: string,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('banFromChat -> chatId: ' + chatId + " userToBan: " + user);
    // ban will delete the user from the chat + add to the banned list + deleted from socket room
    await this.chatService.banFromChat(chatId, user).then( () => {
      // Since the user was banned from the chat, we can remove them from the specific socket room
      clientSocket.removeListener(chatId.toString(), () => {
        this.logger.log('banFromChat -> user ' + user + 'was removed from room ' + chatId.toString());
      });

      // If we could kick user from the chat, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('banFromChat -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('editPassword')
  async editPassword(
      @MessageBody('chatId') chatId: number,
      @MessageBody('chatPassword') chatPassword: string | null,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('clientSocket.id: ' + clientSocket.id);
    this.logger.log('editPassword -> chatId: ' + chatId + " will have its password edited");
    await this.chatService.editPassword(chatId, chatPassword).then( () => {

      // If we could edit the password, get the whole table
      this.chatService.getAllChats().then( (allChats) => {
        // If we could get the whole table from the database, emit it to the frontend
        clientSocket.emit("getChats", allChats);
        this.logger.log('editPassword -> getChats -> all chats were emitted to the frontend');
      });
    });
  }

  @SubscribeMessage('messageChat')
  async messageChat(
      @MessageBody() requestMessageChatDto: RequestMessageChatDto,
      @ConnectedSocket() clientSocket: Socket) {
    this.logger.log('messageChat -> requestMessageChatDto: ', requestMessageChatDto);
    // TODO: only send (and emit) message if user is not muted from the chat
    const ret : ResponseMessageChatDto[] = await this.chatService.sendChatMessage(requestMessageChatDto);
    // A message was received and saved into the database, so we can emit it to everyone on the specific socket room
    const theChat : NewChatEntity = await this.chatRepository.getOneChat(requestMessageChatDto.chatId);
    clientSocket.emit(theChat.name, ret);
  }

  @SubscribeMessage('registerChat')
  registerChat(@MessageBody() requestRegisterChatDto: RequestRegisterChatDto) {
    this.logger.log('registerChat -> requestRegisterChatDto: ', requestRegisterChatDto);
    // const ret = this.chatService.messageChat(requestMessageChatDto);
    // this.ws_server.emit('new_chat', ret);
    // return ret; if needed
  }
}
