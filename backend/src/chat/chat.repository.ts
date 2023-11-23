import {Injectable, Logger} from '@nestjs/common';
import { Repository } from 'typeorm';
import { NewChatEntity } from './entities/new-chat.entity';

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);
	constructor() {
		// @ts-ignore
		super();
		this.logger.log('constructor');
	}


}
