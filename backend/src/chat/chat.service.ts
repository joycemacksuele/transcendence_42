import {Injectable, Logger} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import {ChatMessageEntity} from "./entities/chat-message.entity";
import {ChatType} from "./utils/chat-utils";
import {NewChatEntity} from "./entities/new-chat.entity";
import {UsersCanChatRepository, ChatRepository} from "./chat.repository";
import {ChatMessageRepository} from "./chat-message.repository";
import {RequestMessageChatDto} from "./dto/request-message-chat.dto";
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {ResponseMessageChatDto} from "./dto/response-message-chat.dto";
import {UserService} from "../user/user.service";
import {UserEntity} from "src/user/user.entity";
import {UsersCanChatEntity} from "./entities/users-can-chat.entity";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
      // @InjectRepository(NewChatEntity)
      public readonly usersCanChatRepository: UsersCanChatRepository,
      public readonly chatRepository: ChatRepository,
      public readonly chatMessageRepository: ChatMessageRepository,
      public readonly userService: UserService
  ) {
    this.logger.log('constructor');
  }

  async sendChatMessage(requestMessageChatDto: RequestMessageChatDto) : Promise<ResponseNewChatDto> {
	const now : number = new Date().getTime();
	const user : UserEntity = await this.userService.getUserByLoginName(requestMessageChatDto.loginName);
	const thenStr = await this.usersCanChatRepository.createQueryBuilder("users_can_chat")
		.select('users_can_chat.timeStamp as "timeStamp"')
		.where('new_chat.id = :chatId AND user.id = :userId', {chatId: requestMessageChatDto.chatId, userId: user.id})
		.leftJoin("users_can_chat.chat", "new_chat")
		.leftJoin("users_can_chat.user", "user")
		.getRawOne()
	const then : number = +(thenStr.timeStamp);
	this.logger.log("Now: ", now);
	this.logger.log("Then: ", then);
	if (then <= now) {
	    const chatMessage = new ChatMessageEntity();
		chatMessage.message = requestMessageChatDto.message;
	    chatMessage.creator = await this.userService.getUserByLoginName(requestMessageChatDto.loginName);
		chatMessage.chatbox = await this.chatRepository.findOneOrFail({where: {id: requestMessageChatDto.chatId}});
	    await this.chatMessageRepository.save(chatMessage);
		return await this.chatRepository.getOneChatDto(requestMessageChatDto.chatId);
	} else {
		return await this.chatRepository.getOneChatDto(requestMessageChatDto.chatId);
    }
  }

  async getAllChats(): Promise<ResponseNewChatDto[]> {
    this.logger.log('getAllChats');
    return await this.chatRepository.getAllChats();
  }

  async createChat(requestNewChatDto: RequestNewChatDto, creator: string)  {
    const chatEntity = new NewChatEntity();
    chatEntity.name = requestNewChatDto.name;
    chatEntity.type = requestNewChatDto.type;
    chatEntity.password = null;
    chatEntity.creator = await this.userService.getUserByLoginName(creator);
    chatEntity.admins = [];
    chatEntity.admins.push(chatEntity.creator);
    chatEntity.users = [];
    chatEntity.users.push(chatEntity.creator);

    chatEntity.usersCanChat = [];

    chatEntity.bannedUsers = [];
    if (requestNewChatDto.type == ChatType.PRIVATE) {
      // chat name is the name of the friend in case of a private chat
      chatEntity.name = requestNewChatDto.name;
      // If it is a PRIVATE chat we need to add the friend to the users list
      const friend = await this.userService.getUserByLoginName(requestNewChatDto.name);
      chatEntity.users.push(friend);

    } else if (requestNewChatDto.type == ChatType.PROTECTED) {
      if (requestNewChatDto.password == null) {
        throw new Error('[createChat] Password is required for PROTECTED group');
      }
      try {
        chatEntity.password = await bcryptjs.hash(requestNewChatDto.password, 10);
      } catch (err) {
        throw new Error('[createChat] Can not hash password');
      }
    }
    return this.chatRepository.save(chatEntity).then(async r => {
      this.logger.log('[createChat] chat created: ' + r.name);
	  // Add creator to the UsersCanChatEntity:
      this.usersCanChatRepository.addNewUserToUsersCanChatEntity(r, r.creator).then(r2 => {
	    this.logger.log('[createChat][addNewUserToUsersCanChatEntity] UsersCanChatEntity ' + r2.id + ' created for the bzzzt ' + chatEntity.creator.loginName);
      });
      if (requestNewChatDto.type == ChatType.PRIVATE) {
        const friend = await this.userService.getUserByLoginName(requestNewChatDto.name);
        // Add friend to the UsersCanChatEntity:
        this.usersCanChatRepository.addNewUserToUsersCanChatEntity(r, friend).then(r2 => {
          this.logger.log('[createChat][addNewUserToUsersCanChatEntity] UsersCanChatEntity ' + r2.id + ' created for the friend ' + friend.loginName);
        });
      }      
      return chatEntity;
    });
  }

  async addNewUserToUsersCanChatEntity(chatEntity: NewChatEntity, user: UserEntity) {
    return await this.usersCanChatRepository.addNewUserToUsersCanChatEntity(chatEntity, user);
  }

  async saveNewUserToChat(foundEntityToJoin: NewChatEntity, intraName: string, chatId: number) {
    // Now we have the entity to update the users' array
    const foundUser : UserEntity = await this.userService.getUserByLoginName(intraName);
    // this.logger.log('[saveNewUserToChat] new users list: ' + foundEntityToJoin.users);
    this.chatRepository.joinChat(foundUser, foundEntityToJoin).then(r => {
      this.logger.log('[saveNewUserToChat] joined chat -> chatId should match: ' + chatId + " = " + r.id);
    });
    return true;
  }

  async joinChat(chatId: number, password: string, intraName: string)  {
    await this.chatRepository.findOneOrFail({
      where: {
        id: chatId,
      },
    }).then((foundEntityToJoin) => {
      if (foundEntityToJoin.type == ChatType.PROTECTED && foundEntityToJoin.password == null) {
        throw new Error('Password is required for PROTECTED group');
      } else {
        if (foundEntityToJoin.type == ChatType.PROTECTED) {
          // Join a PROTECTED chat
          bcryptjs.hash(password, 10).then((password: string) => {
            this.logger.log('[joinChat] hashed password: ', password);

            // TODO HERE EVERYTIME ITS CREATING A NEW HASH SO THE COMPARE IS NOT WORKING
            if (bcryptjs.compare(password, foundEntityToJoin.password)) {
              this.logger.log('[joinChat] Password if ok, joining the chat');
              return this.saveNewUserToChat(foundEntityToJoin, intraName, chatId);
            }
          }).catch((err: string) => {
            throw new Error('[joinChat] Can not hash password -> err: ' + err);
          });
        } else {
          // Join a PUBLIC OR PRIVATE chat
          this.logger.log('[joinChat] No password required, joining the chat');
          return this.saveNewUserToChat(foundEntityToJoin, intraName, chatId);
        }
      }
    }).catch((err: string) => {
      throw new Error('[joinChat] Could not join chat -> err: ' + err);
    });
    return false;
  }

  async addAdmin(chatId: number, newAdmin: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundChatEntityToAdd: NewChatEntity) => {
      const userEntity = await this.userService.getUserByLoginName(newAdmin);
      // Now we have the entity to update the users' array
      return await this.chatRepository.addAdmin(userEntity, foundChatEntityToAdd);
    }).catch((err: string) => {
      throw new Error('[addAdmin] Could not add admin to chat -> err: ' + err);
    });
    return false;
  }

  async muteFromChat(chatId: number, intraName: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundChatEntity: NewChatEntity) => {

      // We have to know if the user to be muted is already in the UsersCanChatEntity
      const userEntity = await this.userService.getUserByLoginName(intraName);
      // Now we have the entity to add the user and timestamp to the usersCanChat array
      return await this.usersCanChatRepository.updateMutedTimeStamp(userEntity, foundChatEntity);
    }).catch((err: string) => {
      throw new Error('[muteFromChat] Could not mute user from chat -> err: ' + err);
    });
    return false;
  }

  async banFromChat(chatId: number, intraName: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundChatEntity: NewChatEntity) => {
      const userEntity = await this.userService.getUserByLoginName(intraName);
      // Now we have the entity to update the users' array (delete banned user) and add the user to the bannedUsers array
      await this.chatRepository.banUserFromChat(userEntity, foundChatEntity);
      return await this.chatRepository.deleteUserFromChat(foundChatEntity, userEntity);
      // TODO DELETE FROM ADMIN LIST, USERS_CAN_CHAT
    }).catch((err: string) => {
      throw new Error('[banFromChat] Could not ban user from chat -> err: ' + err);
    });
    return false;
  }

  async addUsers(chatId: number, newUsers: string[])  {
    await this.chatRepository.getOneChat(chatId).then(async (foundChatEntityToAdd: NewChatEntity) => {
      newUsers.map(async (newUser) => {
        const userEntity = await this.userService.getUserByLoginName(newUser);
        // Now we have the entity to update the users' array
        await this.chatRepository.joinChat(userEntity, foundChatEntityToAdd);
      });
    }).catch((err: string) => {
      throw new Error('[addUsers] Could not add users to chat -> err: ' + err);
    });
    return false;
  }

  async leaveChat(chatId: number, intraName: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundChatEntityToLeave: NewChatEntity) => {
      const userToDelete = await this.userService.getUserByLoginName(intraName);
      // Now we have the entity to update the users' array
      await this.chatRepository.deleteUserFromChat(foundChatEntityToLeave, userToDelete);

      // Now we can delete this user from the UsersCanChat entity
      await this.usersCanChatRepository.deleteUserFromUsersCanChatEntity(foundChatEntityToLeave, userToDelete);

      // Now we can delete this user from the Admin list
      // TODO DELETE FROM ADMIN LIST, USERS_CAN_CHAT
    }).catch((err: string) => {
      throw new Error('[leaveChat] Could not delete user from chat -> err: ' + err);
    });
    return false;
  }

  async editPassword(chatId: number, chatPassword: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundEntityToEdit: NewChatEntity) => {
      // Now we have the entity to update the password
      return await this.chatRepository.editPasswordFromChat(foundEntityToEdit, chatPassword);
    }).catch((err: string) => {
      throw new Error('[editPassword] Could not edit password -> err: ' + err);
    });
    return false;
  }

  deleteChat(chatId: number) {
    // Then we can delete the chat row form the new_chat_entity
    return this.chatRepository.delete(chatId);

  }

}
