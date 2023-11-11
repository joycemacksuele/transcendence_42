import { Injectable, Logger } from '@nestjs/common';
import {RequestNewChatDto} from "./dto/request-new-chat.dto";
// import { RequestNewChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  // constructor(private readonly userData: RequestNewChatDto) {
  constructor() {
    this.logger.log('[BACKEND LOG] ChatService constructor');
  }

  // createRoom(createChatDto: RequestNewChatDto) {
  createRoom(createChatDto: RequestNewChatDto) {
    // Save to the database:

    return 'This action adds a new room';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  // update(id: number, updateChatDto: UpdateChatDto) {
  update(id: number) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  // public async createRoom(body: ChatDto) {
  //   const user_entity = new UserEntity();
  //   user_entity.name = body.name;
  //   user_entity.admins = [];
  //   user_entity.bannedUsers = [];
  //   user_entity.users = [];
  //   user_entity.type = body.type;
  //   const user = await this.userService.getUserById(body.creator_id);
  //   if (user == null) throw new Error('User not found');
  //   user_entity.creator = user;
  //   user_entity.users.push(user);
  //   user_entity.admins.push(user);
  //   if (body.type == ChannelType.PROTECTED_CHANNEL) {
  //     if (body.password == null)
  //       throw new Error('Password is required for PROTECTED_CHANNEL');
  //     try {
  //       user_entity.pwd = await bcrypt.hash(body.password, 10);
  //     } catch (err) {
  //       throw new Error('Can not hash password');
  //     }
  //   }
  //   const ret = await this.channelRepository.save(user_entity);
  //   this.server.emit('new_channel', ret);
  //   return user_entity;
  // }
}
