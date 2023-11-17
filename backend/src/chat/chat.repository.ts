import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NewChatEntity } from './entities/new-chat.entity';

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {

	constructor() {
		console.log('constructor');
		// @ts-ignore
		super();
	}


}
