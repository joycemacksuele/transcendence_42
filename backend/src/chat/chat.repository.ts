import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import {NewChatEntity} from './entities/new-chat.entity';
import {UserEntity} from "src/user/user.entity";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {ResponseMessageChatDto} from "./dto/response-message-chat.dto";
import {ChatType} from "./utils/chat-utils";

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

	public async getOneChatDto(chatId: number) {
		const chat: NewChatEntity = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
			.where('new_chat.id = :id', {id: chatId})
			.getRawOne();
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
		const users = chatUsers.map((usersList) => {
			console.log("usersList.users: ", usersList.users);
			return usersList.users;
		});
		this.logger.log('users != null: ' + users.toString());
		if (users.toString()) {
			responseDto.users = users;
		}
		const chatAdmins = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "admins"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.admins", "user")
			.getRawMany();
		responseDto.admins = chatAdmins.map((adminsList) => {
			return adminsList.admins;
		});
		const chatMutedUsers = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "mutedUsers"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.mutedUsers", "user")
			.getRawMany();
		responseDto.mutedUsers = chatMutedUsers.map((mutedUsersList) => {
			return mutedUsersList.mutedUsers;
		});
		const chatBannedUsers = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "bannedUsers"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.bannedUsers", "user")
			.getRawMany();
		responseDto.bannedUsers = chatBannedUsers.map((bannedUsersList) => {
			return bannedUsersList.bannedUsers;
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
					.select('user.profileName as "loginName"')
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
			const users = chatUsers.map((usersList) => {
				console.log("usersList.users: ", usersList.users);
				return usersList.users;
			});
			this.logger.log('users != null: ' + users.toString());
			if (users.toString()) {
				responseDto.users = users;
			}
			const chatAdmins = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "admins"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.admins", "user")
				.getRawMany();
			responseDto.admins = chatAdmins.map((adminsList) => {
				return adminsList.admins;
			});
			const chatMutedUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "mutedUsers"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.mutedUsers", "user")
				.getRawMany();
			responseDto.mutedUsers = chatMutedUsers.map((mutedUsersList) => {
				return mutedUsersList.mutedUsers;
			});
			const chatBannedUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "bannedUsers"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.bannedUsers", "user")
				.getRawMany();
			responseDto.bannedUsers = chatBannedUsers.map((bannedUsersList) => {
				return bannedUsersList.bannedUsers;
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
						.select('user.profileName as "loginName"')
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
		console.log("foundEntityToJoin: ", foundEntityToJoin);
		foundEntityToJoin.users = foundEntityToJoin.users.filter((user: UserEntity) => {
			return user.id !== userEntity.id;
		});
		if (!foundEntityToJoin.users.toString()) {
			await this.delete(foundEntityToJoin.id);
		} else {
			await this
				.manager
				.save(foundEntityToJoin);
		}
		return true
	}

	public async joinChat(user: UserEntity, chat: NewChatEntity) {
		let chatToJoin = await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', { id: chat.id })
			.leftJoinAndSelect("new_chat.users", "user")
			.getOne();
		chatToJoin.users.push(user);
		await this
			.manager
			.save(chatToJoin);
		return chatToJoin
	}

	public async muteUserFromChat(user: UserEntity, chat: NewChatEntity) {
		let chatToMute = await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', { id: chat.id })
			.leftJoinAndSelect("new_chat.mutedUsers", "mutedUser")
			.getOne();
		chatToMute.mutedUsers.push(user);
		await this
			.manager
			.save(chatToMute);
		return chatToMute
	}

	public async banUserFromChat(user: UserEntity, chat: NewChatEntity) {
		let chatToBan = await this
			.createQueryBuilder("new_chat")
			.where('new_chat.id = :id', { id: chat.id })
			.leftJoinAndSelect("new_chat.bannedUsers", "bannedUser")
			.getOne();
		chatToBan.bannedUsers.push(user);
		await this
			.manager
			.save(chatToBan);
		return chatToBan
	}

	public async editPasswordFromChat(foundEntityToJoin: NewChatEntity, chatPassword: string) {
		console.log("foundEntityToJoin: ", foundEntityToJoin);
		if (foundEntityToJoin.type == ChatType.PROTECTED) {
			if (chatPassword != null) {
				bcryptjs.hash(chatPassword, 10).then((password: string) => {
					this.logger.log('[editPasswordFromChat] hashed password: ', password);
					foundEntityToJoin.password = password;
				}).catch((err: string) => {
					throw new Error('[editPasswordFromChat] Can not hash password -> err: ' + err);
				});
			} else {
				// If password is deleted we want to set the chat type to PUBLIC
				foundEntityToJoin.password = null;
				foundEntityToJoin.type = ChatType.PUBLIC;
			}
			await this
				.manager
				.save(foundEntityToJoin);
		}
		return true
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
