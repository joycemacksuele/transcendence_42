import {Injectable, Logger} from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
import {NewChatEntity} from './entities/new-chat.entity';
import {UserEntity} from "src/user/user.entity";
import {ChatMessageEntity} from "./entities/chat-message.entity";

@Injectable()
export class ChatMessageRepository extends Repository<ChatMessageEntity> {
	private readonly logger = new Logger(ChatMessageRepository.name);
	constructor(private dataSource: DataSource)
	{
		super(ChatMessageEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}
}
