import {Injectable, Logger} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { NewChatEntity } from './entities/new-chat.entity';
import { ResponseNewChatDto } from "./dto/response-new-chat.dto";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);;
	constructor(private dataSource: DataSource)
	{
		super(NewChatEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}

	public async joinChat(user : UserEntity, chat : NewChatEntity) {
		let chatusers = await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', { id: chat.id })
			.leftJoinAndSelect("new_chat.users", "user")
			.getOne();
		await chatusers.users.push(user);
		await this
			.manager
			.save(chatusers);
	}

	public async findChats() {
		const amusers = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.chatName as "chatName", new_chat.chatType as "chatType", new_chat.chatPassword as "chatPassword", new_chat.creatorId as "creatorId"')
			.getRawMany();
		const newusers = await Promise.all(amusers.map(async (chat) => {
			const chatusers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', { id: chat.id })
				.leftJoin("new_chat.users", "user")
				.getRawMany();
			chat.users = await chatusers.map((userslist) => {
				return userslist.users;
			});
			return chat;
		}));
		return newusers;
	}

/*
	public async findOma() {
		const amusers = await this.find();
		this.logger.log("Xerp", amusers);
		return amusers;
	}
*/
}
