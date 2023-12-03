import {Injectable, Logger} from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
import {NewChatEntity} from './entities/new-chat.entity';
import {UserEntity} from "src/user/user.entity";

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);
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
		const newChatTable: NewChatEntity[] = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
			.getRawMany();
		return await Promise.all(newChatTable.map(async (chat: NewChatEntity) => {
			const chatUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.users", "user")
				.getRawMany();
			chat.users = chatUsers.map((usersList) => {
				return usersList.users;
			});
			const chatAdmins = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.admins", "user")
				.getRawMany();
			chat.admins = chatAdmins.map((adminsList) => {
				return adminsList.users;
			});
			chat.creator = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.creator", "user")
				.getRawOne();
			return chat;
		}));
	}

	/*
        public async findOma() {
            const amusers = await this.find();
            this.logger.log("Xerp", amusers);
            return amusers;
        }
    */
}