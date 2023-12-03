import { Injectable, Logger } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {NewChatEntity} from "./entities/new-chat.entity";
import {ChatType} from "./utils/chat-utils";
import {ChatRepository} from "./chat.repository";
import * as bcryptjs from 'bcryptjs';
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {MessageBody} from "@nestjs/websockets";
import {UserService} from "../user/user.service";
import {UserEntity} from "src/user/user.entity";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
      // @InjectRepository(NewChatEntity)
      public readonly chatRepository: ChatRepository,
      public readonly userService: UserService
  ) {
    this.logger.log('constructor');
  }

  async createChat(requestNewChatDto: RequestNewChatDto, creator: string)  {
    const chatEntity= new NewChatEntity();
    chatEntity.name = requestNewChatDto.name;
    chatEntity.type = requestNewChatDto.type;
    chatEntity.password = null;
    chatEntity.creator = await this.userService.getUserByLoginName(creator);
    chatEntity.admins = [];
    chatEntity.admins.push(chatEntity.creator);
    chatEntity.users = [];
    chatEntity.users.push(chatEntity.creator);
    // chatEntity.bannedUsers = [];
    if (requestNewChatDto.type == ChatType.PRIVATE) {
      // If it is a PRIVATE chat we need to add the friend to the users list
      // chat name for private chat  = friend's name
      chatEntity.users.push(await this.userService.getUserByLoginName(requestNewChatDto.name));
    } else if (requestNewChatDto.type == ChatType.PROTECTED) {
      if (requestNewChatDto.password == null) {
        throw new Error('Password is required for PROTECTED group');
      }
      try {
        chatEntity.password = await bcryptjs.hash(requestNewChatDto.password, 10);
      } catch (err) {
        throw new Error('Can not hash password');
      }
    }
    // const new_chat = this.chatRepository.create(requestNewChatDto);// this can create an Entity out of an object if var name matches
    this.chatRepository.save(chatEntity).then(r => {
      this.logger.log('NewChatEntity chat created: ' + r.name);
    });
  }

  async saveNewUserToChat(foundEntityToJoin: NewChatEntity, intraName: string, chatId: number) {
    // Now we have the entity to update the member's array
    const foundUser : UserEntity = await this.userService.getUserByLoginName(intraName);
    // this.logger.log('[joinChat] new members list: ' + foundEntityToJoin.users);
    this.chatRepository.joinChat(foundUser, foundEntityToJoin).then(r => {
      this.logger.log('[joinChat] joined chat -> chatId should match: ' + chatId + " = " + r.id);
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
        this.logger.log('[joinChat] password: ', password);
        // TODO HERE EVERYTIME ITS CREATING A NEW HASH SO THE COMPARE IS NOT WORKING
        bcryptjs.hash(password, 10).then((password) => {
          this.logger.log('[joinChat] password: ', password);
          this.logger.log('[joinChat] foundEntityToJoin.password: ', foundEntityToJoin.password);

          if (bcryptjs.compare(password, foundEntityToJoin.password)) {
            this.logger.log('[joinChat] Password if ok, joining the chat');
            return this.saveNewUserToChat(foundEntityToJoin, intraName, chatId);
          }
        }).catch((err) => {
          throw new Error('[joinChat] Can not hash password -> err: ' + err);
        });
      } else {
        // Join a PUBLIC OR PRIVATE chat
        this.logger.log('[joinChat] No password required, joining the chat');
        return this.saveNewUserToChat(foundEntityToJoin, intraName, chatId);
      }
    }).catch((err) => {
      throw new Error('[joinChat] Could not find chat entity to join -> err: ' + err);
    });
    return false;
  }

  deleteUserFromChat(foundEntityToJoin: NewChatEntity, intraName: string, chatId: number) {
    // Now we have the entity to update the member's array
    foundEntityToJoin.users.forEach( (item, index) => {
      if(item.loginName === intraName) {
        foundEntityToJoin.users.splice(index, 1);
      }
    });
    this.logger.log('[deleteUserFromChat] new members list: ' + foundEntityToJoin.users);
    this.chatRepository.save(foundEntityToJoin).then(r => {
      this.logger.log('[deleteUserFromChat] left chat -> chatId should match: ' + chatId + " = " + r.id);
    });
    return true;
  }

  async leaveChat(chatId: number, intraName: string)  {
    await this.chatRepository.findOneOrFail({
      where: {
        id: chatId,
      },
    }).then((foundEntityToJoin) => {
        return this.deleteUserFromChat(foundEntityToJoin, intraName, chatId);
    }).catch((err) => {
      throw new Error('[leaveChat] Could not find chat entity to join -> err: ' + err);
    });
    return false;
  }

  async getAllChats() {
    this.logger.log('getAllChats');
    // const query = this.chatRepository.createQueryBuilder().select("\"chatName\"").orderBy("ctid", "DESC");
    // this.logger.log("ChatService query.getQuery(): ", query.getQuery());
    // return this.chatRepository.query(query.getQuery());
    // return this.chatRepository.find({
    //   order: {
    //     id: "DESC",
    //   },
    // });
    return await this.chatRepository.findChats();
  }

  deleteChat(chatId: number) {
    return this.chatRepository.delete(chatId);
  }

}
