import {IsString, IsEnum, IsNumber, IsStrongPassword} from 'class-validator';
import {ChatType} from '../utils/chat-utils'

export class ResponseNewChatDto {

    @IsNumber()
    id: number;

    @IsString()
    chatName: string;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    @IsEnum(ChatType)
    chatType: ChatType;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    // @IsString()
    // @IsOptional()
    // @IsStrongPassword()
    // chatPassword: string | undefined;
}
