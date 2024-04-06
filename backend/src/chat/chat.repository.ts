import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
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
			return usersCanChatRow;
		} catch (err) {
			throw new Error('[addNewUserToUsersCanChatEntity] err: ' + err as string);
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

			if (usersCanChatRow != undefined) {
				this.logger.log("[updateMutedTimeStamp] usersCanChatRow: " + usersCanChatRow);

				usersCanChatRow.timeStamp = (new Date().getTime() + 120000).toString();// 2 min to get un-muted
				this.logger.log("[updateMutedTimeStamp]: User " + user.loginName + " will be muted for 2 min. New timestamp: " + usersCanChatRow.timeStamp);
				await this
					.manager
					.save(usersCanChatRow)
			}
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
			if (usersCanChatRow != undefined) {
				this.logger.log("[deleteUserFromUsersCanChatEntity] usersCanChatRow: " + usersCanChatRow);
				await this.delete(usersCanChatRow.id);
				// await this.delete(usersCanChatRow);
				return usersCanChatRow;
			}
		} catch (err) {
			throw new Error('[deleteUserFromUsersCanChatEntity] err: ' + err);
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
		try {
			return await this
				.createQueryBuilder("new_chat")
				.where('new_chat.id = :id', {id: chatId})
				.leftJoinAndSelect("new_chat.creator", "creator")
				.leftJoinAndSelect("new_chat.users", "user")
				.leftJoinAndSelect("new_chat.admins", "admin")
				.leftJoinAndSelect("new_chat.bannedUsers", "bannedUsers")
				.getOne();
		} catch (err) {
			throw new Error('[getOneChat] err: ' + err);
		}
	}

	private async getOneRowAndSaveAsDTO(chat: NewChatEntity) {
		const responseDto: ResponseNewChatDto = new ResponseNewChatDto();
		responseDto.id = chat.id;
		this.logger.log('[getChat] NewChat id: ' + chat.id);
		responseDto.name = chat.name;
		this.logger.log('[getChat] NewChat name: ' + chat.name);
		responseDto.type = chat.type;
		this.logger.log('[getChat] NewChat type: ' + chat.type);

		// ----------- get chat creator
		await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "creator"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.creator","user")
			.getRawOne()
			.then((chatCreator) => {
				responseDto.creator = chatCreator.creator;
				this.logger.log('[getChat] NewChat creator: ' + chatCreator.creator);
			});

		// ----------- get chat users list - intra name
		await this
			.createQueryBuilder("new_chat")
			.select('user.loginName as "users"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.users", "user")
			.getRawMany()
			.then((chatUsersIntra) => {
				const usersIntraName = chatUsersIntra.map((usersList) => {
					return usersList.users;
				});
				
				if (usersIntraName.toString()) {
					this.logger.log('[getChat] Users in the chat ' + chat.name + ',  (Intra Name): ' + usersIntraName.toString());
					responseDto.usersIntraName = usersIntraName;
				} else {
					this.logger.log('[getChat] No users in the chat: ' + chat.name);
				}
			});

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
			return adminsList.admins;
		});
		this.logger.log('[getChat] Admins in the chat: ' + responseDto.admins);

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
					throw new Error("[getChat] Can't find the muted user in the user entity table " + chat.name + ". error: " + error);
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
		if (responseDto.bannedUsers.toString()) {
			this.logger.log('[getChat] Banned users in the chat: ' + responseDto.bannedUsers.toString());
		} else {
			this.logger.log('[getChat] No banned users in the chat: ' + chat.name);
		}

		// ----------- get chat messages
		const chatMessages = await this
			.createQueryBuilder("new_chat")
			.select('chat_message.id as "id", chat_message.message as "message", chat_message.creator as "creator"')
			.where('new_chat.id = :id', {id: chat.id})
			.leftJoin("new_chat.messages", "chat_message")
			.orderBy("chat_message.id", "ASC")
			.getRawMany();
		responseDto.messages = await Promise.all(chatMessages.map(async (messagesList) => {
			const responseDto_inner : ResponseMessageChatDto = new ResponseMessageChatDto();
			responseDto_inner.id = messagesList.id;
			responseDto_inner.message = messagesList.message;
			this.logger.log("[getChat] NewChat message(s): " + messagesList.message);
			try {
				const messageCreator = await this
					.createQueryBuilder("new_chat")
					.select('user.loginName as "loginName", user.id as "userId"')
					.where('user.id = :id', {id: messagesList.creator})// TODO: There is probably something wrong here, it was as creatorId before and we were still getting the exception
					.leftJoin("new_chat.users", "user")
					.getRawOne();
				responseDto_inner.creator = messageCreator.loginName;
				responseDto_inner.creator_id = messageCreator.userId;
				this.logger.log("[getChat] NewChat message sender: " + messageCreator.loginName);
				return responseDto_inner;
			} catch (err) {
				this.logger.log("[getChat] Can't find user to set the ResponseMessageChatDto");
				// throw new Error('[getChat] err: ' + err);// TODO ERROR: err: TypeError: Cannot read properties of undefined (reading 'loginName')
			}
		}));

		return responseDto;
	}

	public async getOneChatDto(chatId: number) {
		try {
			const chat: NewChatEntity = await this
				.createQueryBuilder("new_chat")
				.orderBy('new_chat.id', 'DESC')
				.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
				.where('new_chat.id = :id', {id: chatId})
				.getRawOne();
			return await this.getOneRowAndSaveAsDTO(chat);
		} catch (err) {
			throw new Error('[getOneChatDto] err: ' + err);
		}
	}

	public async getAllChats() {
		try {
			const newChatTable: NewChatEntity[] = await this
				.createQueryBuilder("new_chat")
				.orderBy('new_chat.id', 'DESC')
				.select('new_chat.id as "id", new_chat.name as "name", new_chat.type as "type", new_chat.password as "password", new_chat.creatorId as "creatorId"')
				.getRawMany();
			return await Promise.all(newChatTable.map(async (chat: NewChatEntity): Promise<ResponseNewChatDto> => {
				// return this.getOneRowAndSaveAsDTO(chat);
				return await this.getOneRowAndSaveAsDTO(chat); // jaka
			}));
		} catch (err) {
			throw new Error('[getAllChats] err: ' + err);
		}
	}

	private async getCreatorIdFromChat(chatId: number) : Promise<number> {
		try {
			return await this
				.createQueryBuilder("new_chat")
				.select('new_chat.creatorId as "creatorId"')
				.where('new_chat.id = :id', {id: chatId})
				.getRawOne()
				.then((chat) => {
					if (chat && chat.creatorId) {
						return chat.creatorId;
					}
					return -1;
				});
		} catch (err) {
			throw new Error('[getCreatorIdFromChat] err: ' + err);
		}
	}

	public async deleteCreatorFromChat(foundChatEntityToLeave: NewChatEntity, userToDelete: UserEntity) {
		try {
			// Delete the user from the creatorId if sh/e is the creator
			await this.getCreatorIdFromChat(foundChatEntityToLeave.id).then((creatorIdFromChat) => {
				if (userToDelete.id == creatorIdFromChat) {

					foundChatEntityToLeave.creator = null;
					this.save(foundChatEntityToLeave).then(() => {
						this.logger.log("[deleteCreatorFromChat] User " + creatorIdFromChat + " is not a creator anymore");
					}).catch((error) => {
						throw new Error('[deleteCreatorFromChat] err: ' + error);
					});
				}
			});
			return true
		} catch (err) {
			throw new Error('[deleteCreatorFromChat] err: ' + err);
		}
	}

	public async deleteUserFromChat(foundChatEntityToLeave: NewChatEntity, userToDelete: UserEntity) {
		try {
			if (!foundChatEntityToLeave.users || !foundChatEntityToLeave.users.toString()) {// I remember checking the size was still true for an empty array
				// TODO DELETE FROM ChatMessageEntity is working?
				await this.delete(foundChatEntityToLeave.id);
				this.logger.log("[deleteUserFromChat] No users left in the chat " + foundChatEntityToLeave.name + ". It was deleted!");
				return false;
			} else {
				// NewChat has users on it, try to see if the user to be deleted is in the array of users
				const index = foundChatEntityToLeave.users.findIndex(user=> user.id == userToDelete.id)
				if (index !== -1) {
					// If user to be deleted was found in the array of users, delete s/he from it and save the entity
					foundChatEntityToLeave.users.splice(index, 1);

					// if we don't have any user left, we can delete the chat
					if (!foundChatEntityToLeave.users || !foundChatEntityToLeave.users.toString()) {
						// TODO DELETE FROM ChatMessageEntity is working?
						return await this.delete(foundChatEntityToLeave.id).then(() => {
							this.logger.log("[deleteUserFromChat] Chat " + foundChatEntityToLeave.name + " has no users, so it was deleted");
							return false;
						}).catch((error) => {
							throw new Error('[deleteUserFromChat] err: ' + error);
						});
					} else {
						// Otherwise we can just save the entity with the updated users array
						await this
							.manager
							.save(foundChatEntityToLeave);
						return true;
					}

				} else {
					this.logger.log("[deleteUserFromChat] User " + userToDelete.loginName + " is not a member of the chat " + foundChatEntityToLeave.name);
					return false;
				}
			}
		} catch (err) {
			throw new Error('[deleteUserFromChat] err: ' + err);
		}
	}

	public async joinChat(user: UserEntity, chat: NewChatEntity) {
		try {
			let chatToJoin = await this
				.createQueryBuilder("new_chat")
				.where('new_chat.id = :id', { id: chat.id })
				.leftJoinAndSelect("new_chat.users", "user")
				.leftJoinAndSelect("new_chat.usersCanChat", "users_can_chat")
				.getOne()

			if (chatToJoin != null) {
				chatToJoin.users.push(user);
				this.logger.log("[joinChat] new Users list ", chatToJoin.users);
			}

			// Add user to the usersCanChatEntity (before saving the chat entity):
			this.usersCanChatRepository.addNewUserToUsersCanChatEntity(chatToJoin, user).then(r => {
				if (r) {
					this.logger.log('[joinChat][addNewUserToUsersCanChatEntity] UsersCanChatEntity id ' + r.id +
						' created for the user ' + user.loginName + " and chat id: " + chat.id);
				}
			});

			await this
				.manager
				.save(chatToJoin);
			return chatToJoin
		} catch (err) {
			throw new Error('[joinChat] err: ' + err);
		}
	}

	public async addAdmin(user : UserEntity, chat : NewChatEntity) {
		try {
			let chatAdmins = await this
				.createQueryBuilder("new_chat")
				.where('new_chat.id = :id', { id: chat.id })
				.leftJoinAndSelect("new_chat.admins", "admin")// TODO why admin and not user for the alias?
				.getOne();
			chatAdmins.admins.push(user);
			await this
				.manager
				.save(chatAdmins);
			return chatAdmins
		} catch (err) {
			throw new Error('[addAdmin] err: ' + err);
		}
	}

	public async banUserFromChat(user: UserEntity, chat: NewChatEntity) {
		try {
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
		} catch (err) {
			throw new Error('[banUserFromChat] err: ' + err);
		}
	}

	public async editPasswordFromChat(foundEntityToEdit: NewChatEntity, chatPassword: string) {
		try {
			this.logger.log("[editPasswordFromChat] foundEntityToEdit: " + foundEntityToEdit);
			if (foundEntityToEdit.type == ChatType.PROTECTED) {
				if (chatPassword != null) {
					const password = bcryptjs.hashSync(chatPassword, 10);
						this.logger.log('[editPasswordFromChat] hashed password: ', password);
					foundEntityToEdit.password = password;
					if (password == undefined) {
						throw new Error('[editPasswordFromChat] Password was not hashed');
					}
				} else {
					// If password is deleted we want to set the chat type to PUBLIC
					foundEntityToEdit.password = null;
					foundEntityToEdit.type = ChatType.PUBLIC;
				}
				await this
					.manager
					.save(foundEntityToEdit);
			}
			return true
		} catch (err) {
			throw new Error('[editPasswordFromChat] err: ' + err);
		}
	}

	public async deleteAdminFromChat(foundEntityToEdit: NewChatEntity, userToDelete: UserEntity) {
		try {
			// NewChat has users on it, try to see if the user to be deleted is in the array of admins
			const index = foundEntityToEdit.admins.findIndex(user=> user.id === userToDelete.id)
			if (index !== -1) {
				// If user to be deleted was found in the array of admins, delete s/he from it and save the entity
				foundEntityToEdit.admins.splice(index, 1);
				await this
					.manager
					.save(foundEntityToEdit);
				return true
			} else {
				this.logger.log("[deleteAdminFromChat] User " + userToDelete.loginName + " is not an admin of the chat " + foundEntityToEdit.name);
				return false;
			}
		} catch (err) {
			throw new Error('[deleteAdminFromChat] err: ' + err);
		}
	}

	public async deletePasswordFromChat(foundEntityToEdit: NewChatEntity) {
		try {
			this.logger.log("[deletePasswordFromChat] foundEntityToEdit: " + foundEntityToEdit);
			if (foundEntityToEdit.type == ChatType.PROTECTED) {
				// If password is deleted we want to set the chat type to PUBLIC
				foundEntityToEdit.password = null;
				foundEntityToEdit.type = ChatType.PUBLIC;

				await this
					.manager
					.save(foundEntityToEdit);
			}
			return true
		} catch (err) {
			throw new Error('[deletePasswordFromChat] err: ' + err);
		}
	}
}