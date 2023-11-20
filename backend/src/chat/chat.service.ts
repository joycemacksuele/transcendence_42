import { Injectable, Logger } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {NewChatEntity} from "./entities/new-chat.entity";
import {ChatType} from "./utils/chat-utils";
import {ChatRepository} from "./chat.repository";
import * as bcryptjs from 'bcryptjs';
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
import {ResponseNewChatDto} from "./dto/response-new-chat.dto";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
      @InjectRepository(NewChatEntity)
      public readonly chatRepository: ChatRepository,
      // public readonly userService: UserService
  ) {
    this.logger.log('constructor');
  }

  ////////////////////////////////////////////////////////////// Functions for Gateway

  async createChat(requestNewChatDto: RequestNewChatDto)  {
    const chat_entity = new NewChatEntity();
    chat_entity.chatName = requestNewChatDto.chatName;
    chat_entity.chatType = requestNewChatDto.chatType;
    chat_entity.chatCreator = requestNewChatDto.loginName;
    chat_entity.chatAdmins = [];
    chat_entity.chatAdmins.push(requestNewChatDto.loginName);
    chat_entity.chatMembers = [];
    chat_entity.chatMembers.push(requestNewChatDto.loginName);
    // chat_entity.chatBannedUsers = [];
    if (requestNewChatDto.chatType == ChatType.PROTECTED) {
      if (requestNewChatDto.chatPassword == null) {
        throw new Error('Password is required for PROTECTED_CHANNEL');
      }
      try {
        chat_entity.chatPassword = await bcryptjs.hash(requestNewChatDto.chatPassword, 10);
      } catch (err) {
        throw new Error('Can not hash password');
      }
    } else {
      requestNewChatDto.chatPassword = null;
    }
    // const new_chat = this.chatRepository.create(requestNewChatDto);// this can create an Entity out of an object if var name matches
    // await this.chatRepository.save(chat_entity);
    this.chatRepository.save(chat_entity).then(r => {
      this.logger.log('NewChatEntity id: ' +  r.id);
    });
  }

  ////////////////////////////////////////////////////////////// Functions for Controller
  async getAllChatNames(): Promise<ResponseNewChatDto[]> {
    this.logger.log('getAllChatNames');
    // const query = this.chatRepository.createQueryBuilder().select("\"chatName\"").orderBy("ctid", "DESC");
    // console.log("ChatService query.getQuery(): ", query.getQuery());
    // return this.chatRepository.query(query.getQuery());
    return this.chatRepository.find();
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
