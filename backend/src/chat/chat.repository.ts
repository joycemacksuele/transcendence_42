import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import {NewChatEntity} from './entities/new-chat.entity';
import {MutedEntity} from "./entities/muted.entity";
import {UserEntity} from "src/user/user.entity";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {ResponseMessageChatDto} from "./dto/response-message-chat.dto";
import {ChatType} from "./utils/chat-utils";

@Injectable()
export class ChatMutedRepository extends Repository<MutedEntity> {
	private readonly logger = new Logger(ChatMutedRepository.name);
	constructor(private dataSource: DataSource) {
		super(MutedEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}

	public async addNewUserToMutedEntity(chatEntity: NewChatEntity, user: UserEntity) {
		// chatEntity.usersCanChat = [];
		const muted = new MutedEntity();
		muted.user = user;
		muted.chat = chatEntity;
		muted.timeStamp = new Date().getTime().toString();
		chatEntity.usersCanChat.push(muted);
		await this
			.manager
			.save(muted);
		return muted;
	}

	public async updateMutedTimeStamp(user: UserEntity, chat: NewChatEntity) {
		try {
			const mutedRow = await this
				.createQueryBuilder("muted")
				.select('muted.timeStamp as "timeStamp"')
				// .where('new_chat.id = :id AND user.', {id: chat.id})
				.where('user.id = :id', {id: user.id})
				.leftJoin("muted.user", "user")
				.getOne();// or getOne or getRawOne ?
			mutedRow.chat = chat;
			mutedRow.timeStamp = (new Date().getTime() + 120000).toString();//2 min to get un-muted
			this.logger.log('JOYCE timeStamp: ' + (new Date().getTime() + 120000).toString());
			this.logger.log('JOYCE timeStamp: ' + mutedRow);
			// await this
			// 	.manager
			// 	.save(mutedRow)
		} catch (err) {
			this.logger.log("Can't find muted entity user to update its time stamp");
		}

	}
}

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);
	constructor(
		private dataSource: DataSource,
		private chatMutedRepository: ChatMutedRepository
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

			// ----------- get chat creator
			const chatCreator = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "creator"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.creator","user")
				.getRawOne();
			responseDto.creator = chatCreator.creator;

			// ----------- get chat users list
			const chatUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "users"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.users", "user")
				.getRawMany();
			const users = chatUsers.map((usersList) => {
				this.logger.log("[getAllChats] Chat users: " + usersList.users);
				return usersList.users;
			});
			if (users.toString()) {
				this.logger.log('[getAllChats] users != null: ' + users.toString());
				responseDto.users = users;
			} else {
				this.logger.log('[getAllChats] No users in the chat: ' + chat.name);
			}

			// ----------- get chat admin list
			const chatAdmins = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "admins"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.admins", "user")
				.getRawMany();
			responseDto.admins = chatAdmins.map((adminsList) => {
				return adminsList.admins;
			});

			// ----------- get chat muted users list
			// TODO HERE WE HAVE TO GET ALL MUTED USERS FROM MUTED ENTITY
			// const chatMutedUsers = await this
			// 	.createQueryBuilder("new_chat")
			// 	.select('user.loginName as "mutedUsers"')
			// 	.where('new_chat.id = :id', {id: chat.id})
			// 	.leftJoin("new_chat.usersCanChat", "user")
			// 	.getRawMany();
			// responseDto.mutedUsers = chatMutedUsers.map((mutedUsersList) => {
			// 	return mutedUsersList.user.map;
			// });

			responseDto.mutedUsers = [];
			// TODO New one i AM TRYING NOW
			// const mutedRows : MutedEntity[] = await this
			// 	.createQueryBuilder("new_chat")
			// 	.select('muted.timeStamp as "timeStamp"')
			// 	// .where('new_chat.id = :id', {id: chat.id})
			// 	.leftJoin("new_chat.usersCanChat", "muted")
			// 	.getRawMany();
			// responseDto.mutedUsers = await Promise.all(mutedRows.map(async (mutedRow) => {
			// 	// All users in the MutedEntity that have a time stamp in the future are muted
			// 	if (mutedRow.timeStamp > new Date().getTime()) {
			// 		try {
			// 			const mutedUser = await this
			// 				.createQueryBuilder("new_chat")
			// 				.select('user.loginName as "loginName"')
			// 				.where('user.id = :id', {id: mutedRow.user.id})
			// 				.leftJoin("muted.user", "user")
			// 				.getRawOne();
			// 			return mutedUser.loginName;
			// 		} catch (err) {
			// 			// throw new Error("Can't find user");
			// 			this.logger.log("[getAllChats] Can't find user in the user entity");
			// 		}
			// 	}
			// }));

			// ----------- get chat banned users list
			const chatBannedUsers = await this
				.createQueryBuilder("new_chat")
				.select('user.loginName as "bannedUsers"')
				.where('new_chat.id = :id', {id: chat.id})
				.leftJoin("new_chat.bannedUsers", "user")
				.getRawMany();
			responseDto.bannedUsers = chatBannedUsers.map((bannedUsersList) => {
				return bannedUsersList.bannedUsers;
			});

			// ----------- get chat messages
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

	public async deleteUserFromChat(foundChatEntityToLeave: NewChatEntity, userToDelete: UserEntity) {
		this.logger.log("[deleteUserFromChat] foundChatEntityToLeave: " + foundChatEntityToLeave);
		if (!foundChatEntityToLeave.users.toString()) {
			await this.delete(foundChatEntityToLeave.id);
			this.logger.log("[deleteUserFromChat] No users left in the chat " + foundChatEntityToLeave.name + ". I was deleted!");
			return false;
		} else {
			// Chat has users on it, try to see if the user to be deleted is in the array of users
			const index = foundChatEntityToLeave.users.findIndex(user=> user.id === userToDelete.id)
			if (index !== -1) {
				// If user to be deleted was found in the array of users, delete s/he from it and save the entity
				foundChatEntityToLeave.users.splice(index, 1);
				await this
					.manager
					.save(foundChatEntityToLeave);
			} else {
				this.logger.log("[deleteUserFromChat] User " + userToDelete.loginName + " is not a member of the chat " + foundChatEntityToLeave.name);
				return false;
			}
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
		// Add user to the muted entity:
		chatToJoin.usersCanChat = [];
		this.chatMutedRepository.addNewUserToMutedEntity(chatToJoin, user).then(r => {
			this.logger.log('[joinChat][addNewUserToMutedEntity] MutedEntity ' + r.id + ' created for the ' + user);
		});
		await this
			.manager
			.save(chatToJoin);
		return chatToJoin
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
		this.logger.log("[editPasswordFromChat] foundEntityToJoin: ", foundEntityToJoin);
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
}
