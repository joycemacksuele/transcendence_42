import {Injectable, Logger} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { NewChatEntity } from './entities/new-chat.entity';
import { ResponseNewChatDto } from "./dto/response-new-chat.dto";

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);;
	constructor(private dataSource: DataSource)
	{
		super(NewChatEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}

	public async findChats() {
		const amusers = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.chatName as "chatName", new_chat.chatType as "chatType", new_chat.chatPassword as "chatPassword", new_chat.creatorId as "creatorId", user.loginName as "users"')
			.leftJoin("new_chat.users", "user")
			.getRawMany();
		this.logger.log("Derp", amusers);
		return amusers;
	}
/*
	public async findOma() {
		const amusers = await this.find();
		this.logger.log("Xerp", amusers);
		return amusers;
	}
*/
}
