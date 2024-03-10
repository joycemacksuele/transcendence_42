import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import {NewChatEntity} from './entities/new-chat.entity';
import {UsersCanChatEntity} from "./entities/users-can-chat.entity";
import {UserEntity} from "src/user/user.entity";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {ResponseMessageChatDto} from "./dto/response-message-chat.dto";
import {ChatType} from "./utils/chat-utils";
import {ChatMessageEntity} from "./entities/chat-message.entity";
import {UserService} from "../user/user.service";

@Injectable()
export class UsersCanChatRepository extends Repository<UsersCanChatEntity> {
	private readonly logger = new Logger(UsersCanChatRepository.name);
	constructor(
		private dataSource: DataSource,
		private readonly userService: UserService
	) {
		super(UsersCanChatEntity, dataSource.createEntityManager());
		this.logger.log('constructor');
	}

	public async addNewUserToUsersCanChatEntity(chatEntity: NewChatEntity, user: UserEntity) {
		try {
			let usersCanChatRow = await this
				.createQueryBuilder("users_can_chat")
				.where('new_chat.id = :chatId  AND user.id = :userId', {chatId: chatEntity.id, userId: user.id})
				.leftJoin("users_can_chat.chat", "new_chat")
				.leftJoin("users_can_chat.user", "user")
				.getOne();
			if (usersCanChatRow == undefined) {
				const usersCanChatEntity = new UsersCanChatEntity();
				usersCanChatEntity.user = user;
				usersCanChatEntity.chat = chatEntity;
				usersCanChatEntity.timeStamp = new Date().getTime().toString();
				chatEntity.usersCanChat.push(usersCanChatEntity);
				await this
					.manager
					.save(usersCanChatEntity);
				return usersCanChatEntity;
			}
		} catch (err) {
			throw new Error('[addNewUserToUsersCanChatEntity] err: ' + err);
		}
	}

	public async updateMutedTimeStamp(user: UserEntity, chat: NewChatEntity) {
		try {
			let usersCanChatRow = await this
				.createQueryBuilder("users_can_chat")
				.where('new_chat.id = :chatId  AND user.id = :userId', {chatId: chat.id, userId: user.id})
				.leftJoin("users_can_chat.chat", "new_chat")
				.leftJoin("users_can_chat.user", "user")
				.getOne();

			this.logger.log("JOYCE [usersCanChatRow.user]: ", usersCanChatRow);

			usersCanChatRow.timeStamp = (new Date().getTime() + 120000).toString();// 2 min to get un-muted
			this.logger.log("[updateMutedTimeStamp]: User " + user.loginName + " will be muted for 2 min. New timestamp: " + usersCanChatRow.timeStamp);
			await this
				.manager
				.save(usersCanChatRow)
		} catch (err) {
			throw new Error('[updateMutedTimeStamp] err: ' + err);
		}
	}

	public async deleteUserFromUsersCanChatEntity(chatEntity: NewChatEntity, user: UserEntity) {
		try {
			let usersCanChatRow = await this
				.createQueryBuilder("users_can_chat")
				.where('new_chat.id = :chatId  AND user.id = :userId', {chatId: chatEntity.id, userId: user.id})
				.leftJoin("users_can_chat.chat", "new_chat")
				.leftJoin("users_can_chat.user", "user")
				.getOne();
				await this.delete(usersCanChatRow.id);
				return usersCanChatRow;
		} catch (err) {
			throw new Error('[updateMutedTimeStamp] err: ' + err);
		}
	}
}

@Injectable()
export class ChatRepository extends Repository<NewChatEntity> {
	private readonly logger = new Logger(ChatRepository.name);
	constructor(
		private dataSource: DataSource,
		private readonly usersCanChatRepository: UsersCanChatRepository,
		private readonly userService: UserService
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

	private async getOneRowAndSaveAsDTO(chat: NewChatEntity) {
		const responseDto: ResponseNewChatDto = new ResponseNewChatDto();
		responseDto.id = chat.id;
		this.logger.log('[getChat] MainComponent id: ' + chat.id);
		responseDto.name = chat.name;
		this.logger.log('[getChat] MainComponent name: ' + chat.name);
		responseDto.type = chat.type;
		this.logger.log('[getChat] MainComponent type: ' + chat.type);

		// ----------- get chat creator
		const chatCreator = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "creator"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.creator","user")
			.getRawOne();
		responseDto.creator = chatCreator.creator;
		this.logger.log('[getChat] MainComponent creator: ' + chatCreator.creator);

		// ----------- get chat users list - intra name
		const chatUsersIntra = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "users"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.users", "user")
			.getRawMany();
		const usersIntraName = chatUsersIntra.map((usersList) => {
			return usersList.users;
		});
		if (usersIntraName.toString()) {
			this.logger.log('[getChat] Users in the chat (Intra Name): ' + usersIntraName.toString());
			responseDto.usersIntraName = usersIntraName;
		} else {
			this.logger.log('[getChat] No users in the chat: ' + chat.name);
		}

		// ----------- get chat users list - profile name
		const chatUsers = await this
			.createQueryBuilder("new_chat")
			.select('user.profileName as "users"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.users", "user")
			.getRawMany();
		const users = chatUsers.map((usersList) => {
			return usersList.users;
		});
		if (users.toString()) {
			this.logger.log('[getChat] Users in the chat (Profile Name): ' + users.toString());
			responseDto.usersProfileName = users;
		} else {
			this.logger.log('[getChat] No users in the chat: ' + chat.name);
		}

		// ----------- get chat admin list
		const chatAdmins = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "admins"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.admins", "user")
			.getRawMany();
		responseDto.admins = chatAdmins.map((adminsList) => {
			this.logger.log('[getChat] Admins in the chat: ' + adminsList.admins);
			return adminsList.admins;
		});

		// ----------- get chat muted users list
		const usersCanChatRows = await this
			.createQueryBuilder("new_chat")
			.select('users_can_chat.user as "userId", users_can_chat.chat as "chatId", users_can_chat.timeStamp as "timeStamp"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.usersCanChat", "users_can_chat")
			.getRawMany();
		responseDto.mutedUsers = await Promise.all(usersCanChatRows.map(async (usersCanChatRow) => {
			// All users in the UsersCanChatEntity that have a time stamp in the future are muted
			if (usersCanChatRow.timeStamp > new Date().getTime()) {
				return this.userService.getUserById(usersCanChatRow.userId).then((user) => {
					this.logger.log("[getChat] Muted users in the chat: " + user.loginName);
					return user.loginName;
				}).catch((error) => {
					// return [];
					throw new Error("[getChat] Can't find a muted user for this chat " + chat.name + ". error: " + error);
				})
			}
		}));

		// ----------- get chat banned users list
		const chatBannedUsers = await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "bannedUsers"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.bannedUsers", "user")
			.getRawMany();
		responseDto.bannedUsers = chatBannedUsers.map((bannedUsersList) => {
			this.logger.log("[getChat] Banned users in the chat: " + bannedUsersList.bannedUsers);
			return bannedUsersList.bannedUsers;
		});

		// ----------- get chat messages
		const chatMessages = await this
			.createQueryBuilder("new_chat")
			.select('chat_message.id as "id", chat_message.message as "message", chat_message.creator as "creatorId"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.messages", "chat_message")
			.orderBy("chat_message.id", "ASC")
			.getRawMany();
		responseDto.messages = await Promise.all(chatMessages.map(async (messagesList) => {
			const responseDto_inner : ResponseMessageChatDto = new ResponseMessageChatDto();
			responseDto_inner.id = messagesList.id;
			responseDto_inner.message = messagesList.message;
			this.logger.log("[getChat] MainComponent message(s): " + messagesList.message);
			try {
				const messageCreator = await this
					.createQueryBuilder("new_chat")
					.select('user.loginName as "loginName", user.id as "userId"')
					.where('user.id = :id', {id: messagesList.creatorId})
					.leftJoin("new_chat.users", "user")
					.getRawOne();
				responseDto_inner.creator = messageCreator.loginName;
				responseDto_inner.creator_id = messageCreator.userId;
				this.logger.log("[getChat] MainComponent message sender: " + messageCreator.loginName);
				return responseDto_inner;
			} catch (err) {
				// throw new Error("Can't find user");
				this.logger.log("[getChat] Can't find user to set the ResponseMessageChatDto");
			}
		}));
		return responseDto;
	}

	public async getOneChatDto(chatId: number) {
		const chat: NewChatEntity = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
			.where('new_chat.id = :id', {id: chatId})
			.getRawOne();
		return this.getOneRowAndSaveAsDTO(chat);
	}

	public async getAllChats() {
		const newChatTable: NewChatEntity[] = await this
			.createQueryBuilder("new_chat")
			.orderBy('new_chat.id', 'DESC')
			.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
			.getRawMany();
		return await Promise.all(newChatTable.map(async (chat: NewChatEntity): Promise<ResponseNewChatDto> => {
			return this.getOneRowAndSaveAsDTO(chat);
		}));
	}

	public async deleteUserFromChat(foundChatEntityToLeave: NewChatEntity, userToDelete: UserEntity) {
		this.logger.log("[deleteUserFromChat] foundChatEntityToLeave: " + foundChatEntityToLeave);
		if (!foundChatEntityToLeave.users.toString()) {
			// TODO DELETE FROM ChatMessageEntity AND USERS_CAN_CHAT??
			//     seems like cascade is not working to delete the child rows in the joined tables
			await this.delete(foundChatEntityToLeave.id);
			this.logger.log("[deleteUserFromChat] No users left in the chat " + foundChatEntityToLeave.name + ". I was deleted!");
			return false;
		} else {
			// MainComponent has users on it, try to see if the user to be deleted is in the array of users
			const index = foundChatEntityToLeave.users.findIndex(user=> user.id === userToDelete.id)
			if (index !== -1) {
				// If user to be deleted was found in the array of users, delete s/he from it and save the entity
				foundChatEntityToLeave.users.splice(index, 1);
				await this
					.manager
					.save(foundChatEntityToLeave);

				// After deleting the correct user, if we don't have any oser left, we can delete the chat
				if (!foundChatEntityToLeave.users.toString()) {
					// TODO DELETE FROM ChatMessageEntity AND USERS_CAN_CHAT??
					//     seems like cascade is not working to delete the child rows in the joined tables
					await this.delete(foundChatEntityToLeave.id);
				}
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
			.leftJoinAndSelect("new_chat.usersCanChat", "users_can_chat")
			.getOne();
		chatToJoin.users.push(user);
		// Add user to the usersCanChatEntity:
//		chatToJoin.usersCanChat = [];
		this.usersCanChatRepository.addNewUserToUsersCanChatEntity(chatToJoin, user).then(r => {
			this.logger.log('[joinChat][addNewUserToUsersCanChatEntity] UsersCanChatEntity ' + r.id + ' created for the ' + user);
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
			.leftJoinAndSelect("new_chat.admins", "admin")// why admin and not user for the alias?
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
