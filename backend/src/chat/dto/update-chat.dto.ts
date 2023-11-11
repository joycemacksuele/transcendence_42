import { PartialType } from '@nestjs/mapped-types';
import { RequestNewChatDto } from './request-new-chat.dto';

export class UpdateChatDto extends PartialType(RequestNewChatDto) {
  id: number;
}
