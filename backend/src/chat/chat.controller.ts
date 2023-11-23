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

	@Get('all-chat-names')
	async getAllChatNames() {
		this.logger.log('getAllChatNames');
		return this.chatService.getAllChatNames();
	}

	@Post()
	async createChat(@Body() requestNewChatDto: RequestNewChatDto) {
		this.logger.log('createChat -> requestNewChatDto: ', requestNewChatDto);
		// this.chatService.createChat(requestNewChatDto).then();
	}
}

