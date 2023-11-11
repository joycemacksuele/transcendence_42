import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { NewChatEntity } from './entities/new-chat.entity';

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {

	constructor() {
		console.log('[BACKEND LOG] ChatRepository constructor');
		// @ts-ignore
		super();
	}
}
