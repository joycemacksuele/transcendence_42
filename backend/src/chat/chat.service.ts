import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChatMessageEntity} from "./entities/chat-message.entity";
import {NewChatEntity} from "./entities/new-chat.entity";
import {ChatType} from "./utils/chat-utils";
import {ChatRepository} from "./chat.repository";
import {ChatMessageRepository} from "./chat-message.repository";
import * as bcryptjs from 'bcryptjs';
import {RequestMessageChatDto} from "./dto/request-message-chat.dto";
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {ResponseMessageChatDto} from "./dto/response-message-chat.dto";
import {MessageBody, WsException} from "@nestjs/websockets";
import {UserService} from "../user/user.service";
import {UserEntity} from "src/user/user.entity";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
      // @InjectRepository(NewChatEntity)
      public readonly chatRepository: ChatRepository,
      public readonly chatMessageRepository: ChatMessageRepository,
      public readonly userService: UserService
  ) {
    this.logger.log('constructor');
  }

  async sendChatMessage(requestMessageChatDto: RequestMessageChatDto) : Promise<ResponseNewChatDto> {
    const chatMessage = new ChatMessageEntity();
    chatMessage.message = requestMessageChatDto.message;
    chatMessage.creator = await this.userService.getUserByLoginName(requestMessageChatDto.loginName);
    chatMessage.chatbox = await this.chatRepository.findOneOrFail({where: {id: requestMessageChatDto.chatId}});
    await this.chatMessageRepository.save(chatMessage);
    return await this.chatRepository.getOneChatDto(requestMessageChatDto.chatId);
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
    chatEntity.mutedUsers = [];
    chatEntity.bannedUsers = [];
    if (requestNewChatDto.type == ChatType.PRIVATE) {
      // chat name for private chat = friend's name + our name (so it is unique) -> JOYCE January: I think it's ok to be only the name of the friend
      // chatEntity.name = requestNewChatDto.name + "+" + creator;
      chatEntity.name = requestNewChatDto.name;
      // If it is a PRIVATE chat we need to add the friend to the users list
      chatEntity.users.push(await this.userService.getUserByLoginName(requestNewChatDto.name));
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
    return this.chatRepository.save(chatEntity).then(r => {
      this.logger.log('[createChat] chat created: ' + r.name);
      return chatEntity;
    });
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
      } else if (foundEntityToJoin.type == ChatType.PROTECTED) {
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
    }).catch((err: string) => {
      throw new Error('[joinChat] Could not join chat -> err: ' + err);
    });
    return false;
  }

  async muteFromChat(chatId: number, intraName: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundEntity: NewChatEntity) => {
      const userEntity = await this.userService.getUserByLoginName(intraName);
      // Now we have the entity to add the user to the mutedUsers array
      return await this.chatRepository.muteUserFromChat(userEntity, foundEntity);
    }).catch((err: string) => {
      throw new Error('[muteFromChat] Could not mute user from chat -> err: ' + err);
    });
    return false;
  }

  async banFromChat(chatId: number, intraName: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundEntity: NewChatEntity) => {
      const userEntity = await this.userService.getUserByLoginName(intraName);
      // Now we have the entity to update the users' array (delete banned user) and add the user to the bannedUsers array
      await this.chatRepository.banUserFromChat(userEntity, foundEntity);
      return await this.chatRepository.deleteUserFromChat(foundEntity, userEntity);
      // TODO DELETE FROM ADMIN LIST
    }).catch((err: string) => {
      throw new Error('[banFromChat] Could not ban user from chat -> err: ' + err);
    });
    return false;
  }

  async leaveChat(chatId: number, intraName: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundEntityToLeave: NewChatEntity) => {
      const userEntity = await this.userService.getUserByLoginName(intraName);
      // Now we have the entity to update the users' array
      return await this.chatRepository.deleteUserFromChat(foundEntityToLeave, userEntity);
      // TODO DELETE FROM ADMIN LIST
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

  async addAdmin(chatId: number, newAdmin: string)  {
    await this.chatRepository.getOneChat(chatId).then(async (foundEntityToAdd: NewChatEntity) => {
      const userEntity = await this.userService.getUserByLoginName(newAdmin);
      // Now we have the entity to update the users' array
      return await this.chatRepository.addAdmin(userEntity, foundEntityToAdd);
    }).catch((err: string) => {
      throw new Error('[addAdmin] Could not add admin to chat -> err: ' + err);
    });
    return false;
  }

  deleteChat(chatId: number) {
    return this.chatRepository.delete(chatId);
  }

}
