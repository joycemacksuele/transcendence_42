import { Injectable, Logger } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {NewChatEntity} from "./entities/new-chat.entity";
import {ChatType} from "./utils/chat-utils";
import {ChatRepository} from "./chat.repository";
import * as bcryptjs from 'bcryptjs';
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";
import {MessageBody} from "@nestjs/websockets";
import {UserService} from "src/user/user.service";
import {UserEntity} from "src/user/user.entity";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
//      @InjectRepository(NewChatEntity)
      public readonly chatRepository: ChatRepository,
      public readonly userService: UserService
  ) {
    this.logger.log('constructor');
  }

  async createChat(requestNewChatDto: RequestNewChatDto)  {
    const chatEntity = new NewChatEntity();
    chatEntity.chatName = requestNewChatDto.chatName;
    chatEntity.chatType = requestNewChatDto.chatType;
    chatEntity.creator = await this.userService.getUserByLoginName(requestNewChatDto.loginName);
    chatEntity.admins = [];
    chatEntity.admins.push(chatEntity.creator);
    chatEntity.users = [];
    chatEntity.users.push(chatEntity.creator);
    // chatEntity.chatBannedUsers = [];
    if (requestNewChatDto.chatType == ChatType.PROTECTED) {
      if (requestNewChatDto.chatPassword == null) {
        throw new Error('Password is required for PROTECTED group');
      }
      try {
        chatEntity.chatPassword = await bcryptjs.hash(requestNewChatDto.chatPassword, 10);
      } catch (err) {
        throw new Error('Can not hash password');
      }
    } else {
      requestNewChatDto.chatPassword = null;
    }
    // const new_chat = this.chatRepository.create(requestNewChatDto);// this can create an Entity out of an object if var name matches
    this.chatRepository.save(chatEntity).then(r => {
      this.logger.log('NewChatEntity id: ' +  r.id);
    });
  }

  async joinChat(chatId: number, chatPassword: string, intraName: string)  {
    if (chatPassword == null) {
      throw new Error('Password is required for PROTECTED group');
    }

    await this.chatRepository.findOneOrFail({
      where: {
        id: chatId,
      },
    }).then((foundEntityToJoin) => {

      this.logger.log('[joinChat] chatPassword: ', chatPassword);
      // TODO HERE EVERYTIME ITS CREATEING A NEW HASH SO THE COMPARE IS NOT WORKING
      bcryptjs.hash(chatPassword, 10).then(async (password) => {
        this.logger.log('[joinChat] password: ', password);
        this.logger.log('[joinChat] foundEntityToJoin.chatPassword: ', foundEntityToJoin.chatPassword);

        if (bcryptjs.compare(password, foundEntityToJoin.chatPassword)) {
          this.logger.log('[joinChat] Password if ok');
          // Now we have the entity to update the member's array
          const foundUser : UserEntity = await this.userService.getUserByLoginName(intraName);
          foundEntityToJoin.users = foundEntityToJoin.users.concat(foundUser);
          this.logger.log('[joinChat] new members list: ' + foundEntityToJoin.users);
          this.chatRepository.save(foundEntityToJoin).then(r => {
            this.logger.log('[joinChat] chatId should match: ' + chatId + " = " + r.id);
          });
          return true;
        }
      }).catch((err) => {
        throw new Error('[joinChat] Can not hash password -> err: ' + err);
      });
    }).catch((err) => {
      throw new Error('[joinChat] Could not find chat entity to join -> err: ' + err);
    });
    return true;

  }

  async getAllChats(): Promise<ResponseNewChatDto[]> {
    this.logger.log('getAllChats');
    // const query = this.chatRepository.createQueryBuilder().select("\"chatName\"").orderBy("ctid", "DESC");
    // console.log("ChatService query.getQuery(): ", query.getQuery());
    // return this.chatRepository.query(query.getQuery());
    const out = await this.chatRepository.findChats();
//    const out2 = await this.chatRepository.findOma();
    return out;
  }

  deleteChat(chatId: number) {
    return this.chatRepository.delete(chatId);
  }

}
