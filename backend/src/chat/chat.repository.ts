import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import {NewChatEntity} from './entities/new-chat.entity';
import {UserEntity} from "src/user/user.entity";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {ResponseMessageChatDto} from "./dto/response-message-chat.dto";

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);
	constructor(
		private dataSource: DataSource
	) {
		super(NewChatEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}

	public async getOneChat(chatId: number) {
		return await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', {id: chatId})
			.leftJoinAndSelect("new_chat.users", "user")
			.leftJoinAndSelect("new_chat.admins", "admin")
			.getOne();
	}

	public async getAllChats() {
		const newChatTable: NewChatEntity[] = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
			.getRawMany();
		return await Promise.all(newChatTable.map(async (chat: NewChatEntity): Promise<ResponseNewChatDto> => {
			const responseDto: ResponseNewChatDto = new ResponseNewChatDto();
			responseDto.id = chat.id;
			responseDto.name = chat.name;
			responseDto.type = chat.type;
			const chatCreator = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "creator"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.creator","user")
				.getRawOne();
			responseDto.creator = chatCreator.creator;
			const chatUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.users", "user")
				.getRawMany();
			responseDto.users = chatUsers.map((usersList) => {
				return usersList.users;
			});
			const chatAdmins = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "admins"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.admins", "user")
				.getRawMany();
			responseDto.admins = chatAdmins.map((adminsList) => {
				return adminsList.admins;
			});
			const chatMessages = await this
				.createQueryBuilder("new_chat")
				.select('chat_message.id as "id", chat_message.message as "message", chat_message.creator as "creatorId"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.messages", "chat_message")
				.getRawMany();
			responseDto.messages = await Promise.all(chatMessages.map(async (messagesList) => {
				const responseDto_inner : ResponseMessageChatDto = new ResponseMessageChatDto();
				responseDto_inner.id = messagesList.id;
				responseDto_inner.message = messagesList.message;
				try {
					const messageCreator = await this
						.createQueryBuilder("new_chat")
						.select('user.loginName as "loginName"')
						.where('user.id = :id', {id: messagesList.creatorId})
						.leftJoin("new_chat.users", "user")
						.getRawOne();
					responseDto_inner.creator = messageCreator.loginName;
					return responseDto_inner;
				} catch (err) {
					// throw new Error("Can't find user");
                                        this.logger.log("Can't find user");
				}
			}));
			return responseDto;
		}));
	}

	public async deleteUserFromChat(foundEntityToJoin: NewChatEntity, userEntity: UserEntity) {
		console.log("foundEntityToJoin.users: ", foundEntityToJoin);
		foundEntityToJoin.users = foundEntityToJoin.users.filter((user: UserEntity) => {
			return user.id !== userEntity.id;
		});
		await this
			.manager
			.save(foundEntityToJoin);
		return true
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

	public async addAdmin(user : UserEntity, chat : NewChatEntity) {
		let chatAdmins = await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', { id: chat.id })
			.leftJoinAndSelect("new_chat.admins", "admin")
			.getOne();
		chatAdmins.admins.push(user);
		await this
			.manager
			.save(chatAdmins);
		return chatAdmins
	}
}
