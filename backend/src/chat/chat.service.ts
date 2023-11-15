import { Injectable, Logger } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
import {NewChatEntity} from "./entities/new-chat.entity";
import {ChatType} from "./utils/chat-utils";
import {ChatRepository} from "./chat.repository";


@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
      // @InjectRepository(NewChatEntity)
      private readonly chatRepository: ChatRepository,
      // public readonly userService: UserService
  ) {
    this.logger.log('constructor');
  }

  createChat(requestNewChatDto: RequestNewChatDto) {
    const chat_entity = new NewChatEntity();
    chat_entity.chatName = requestNewChatDto.chatName;
    chat_entity.chatAdmins = [];
    chat_entity.chatMembers = [];
    // chat_entity.chatBannedUsers = [];
    chat_entity.chatType = requestNewChatDto.chatType;
    chat_entity.chatCreator = requestNewChatDto.loginName;
    chat_entity.chatAdmins.push(requestNewChatDto.loginName);
    // chat_entity.chatMembers.push(current_user);
    if (requestNewChatDto.chatType == ChatType.PROTECTED) {
      if (requestNewChatDto.chatPassword == null) {
        throw new Error('Password is required for PROTECTED_CHANNEL');
      }
      // TODO password has to be hashed before saved to the database
      // try {
        chat_entity.chatPassword = requestNewChatDto.chatPassword;
      //   chat_entity.chatPassword = await bcrypt.hash(requestNewChatDto.chatPassword, 10);
      // } catch (err) {
      //   throw new Error('Can not hash password');
      // }
    }
    return this.chatRepository.save(chat_entity);
  }

  // findAll() {
  //   return `This action returns all chat`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }
  //
  // // update(id: number, updateChatDto: UpdateChatDto) {
  // update(id: number) {
  //   return `This action updates a #${id} chat`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
