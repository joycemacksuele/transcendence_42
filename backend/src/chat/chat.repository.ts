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
		let chatUsers = await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', { id: chat.id })
			.leftJoinAndSelect("new_chat.users", "user")
			.getOne();
		chatUsers.users.push(user);
		await this
			.manager
			.save(chatUsers);
		return chatUsers
	}

	public async findChats() {
		const amusers = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
			.getRawMany();
		const newUsers = await Promise.all(amusers.map(async (chat) => {
			const chatUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', { id: chat.id })
				.leftJoin("new_chat.users", "user")
				.getRawMany();
			chat.users = await chatUsers.map((userslist) => {
				return userslist.users;
			});
			return chat;
		}));
		return newUsers;
	}

	/*
        public async findOma() {
            const amusers = await this.find();
            this.logger.log("Xerp", amusers);
            return amusers;
        }
    */
}