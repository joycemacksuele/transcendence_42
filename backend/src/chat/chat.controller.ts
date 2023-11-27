import { Controller, Post, Get, Body, Logger, Delete, Param, HttpCode } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestNewChatDto } from './dto/request-new-chat.dto';

@Controller('chat')
export class ChatController {

	private readonly logger = new Logger(ChatController.name);

	constructor(private readonly chatService: ChatService,
	) {
		this.logger.log('constructor');
	}

	@Get('all-chats')//not being used
	async getAllChats() {
		this.logger.log('getAllChats');
		return this.chatService.getAllChats();
	}

	@Post()// not being use
	async createChat(@Body() requestNewChatDto: RequestNewChatDto) {
		this.logger.log('createChat -> requestNewChatDto: ', requestNewChatDto);
		// this.chatService.createChat(requestNewChatDto).then();
	}

	@Delete('delete-chat/:chatId')// not being used
	deleteChat(@Param('chatId') chatId: number) {
		this.logger.log('deleteChat -> chatId: ' + chatId);
		this.chatService.deleteChat(chatId).then();
	}
}

