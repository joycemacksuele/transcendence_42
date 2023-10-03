import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

// - module is a configuration/header file
//
// - controller/gateway (has endpoints to receive requests from frontend) ->
// service (application logic) ->
// - repository (comunicates with the database or any service that contains data - its an entry point to the dabatabe - it
// also creates a new entry to the already existend table (folowing the table model)) - repository can also use the Entity to automatically
// map the database table to the specific entity(ies)
//
// - Entity object is a representation of ONE entry of the table on the database -> it can be used by the repository to .... or the service to ...
// Entity tranforms an entry/row of a table in code that we can access
// - dto is a data layer that we receive from the frontend or pass to the frontend -> it aggregates data for the response or to receive in a request


// websocket allow the browser sessions to be asynchronous (i.e.: 2 or more users and see the data in real time - no refreshing needed)
// each socket room should have its own entity/table so we can have data persistency since when the socket is closed, the data is lost.


// frontend request (dato - request-dto) -> controller (dato - request-dto) -> service (request-dto) - repository (gets data) -> service (entities -> respose-dto) -> controler (respose-dto) -> frontend (objeto)

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
