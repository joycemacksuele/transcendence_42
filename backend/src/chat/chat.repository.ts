import {Injectable, Logger} from '@nestjs/common';
import {Repository, DataSource} from 'typeorm';
import {NewChatEntity} from './entities/new-chat.entity';
import {UserEntity} from "src/user/user.entity";

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);
	constructor(private dataSource: DataSource) {
		// @ts-ignore
		super(NewChatEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}

	// public async joinChat(user : UserEntity, chat : NewChatEntity) {
	// 	let chat_users = await this
	// 		.createQueryBuilder("new_chat")
	// 		.where('new_chat.id = :id', { id: chat.id })
	// 		.leftJoinAndSelect("new_chat.users", "user")
	// 		.getOne();
	// 	chat_users.users.push(user);
	// 	await this
	// 		.manager
	// 		.save(chat_users);
	// }

	// public async findChats() {
	// 	const amusers: NewChatEntity[] = await this
	// 		.createQueryBuilder("new_chat")
	// 		.orderBy('new_chat.id', 'DESC')
	// 		.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creator as "creator"')
	// 		.getRawMany();
	// 	return await Promise.all(amusers.map(async (chat) => {
	// 		const chat_users = await this
	// 			.createQueryBuilder("new_chat")
	// 			.select('user.loginName as "users"')
	// 			.where('new_chat.id = :id', {id: chat.id})
	// 			.leftJoin("new_chat.users", "user")
	// 			.getRawMany();
	// 		chat.users = chat_users.map((users_list) => {
	// 			return users_list.users;
	// 		});
	// 		return chat;
	// 	}));
	// }
}
