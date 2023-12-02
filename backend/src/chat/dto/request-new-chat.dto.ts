import {IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum, IsStrongPassword} from 'class-validator';
import {ChatType} from '../utils/chat-utils'

export class RequestNewChatDto {

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @IsNotEmpty({ message: 'Required' })
    name: string;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    // @IsNotEmpty({ message: 'Required' })
    @IsEnum(ChatType)
    type: ChatType;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    // @IsStrongPassword()
    @MinLength(5)
    @MaxLength(15)
    @IsOptional()
    password: string | null;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    @IsNotEmpty({ message: 'Required' })
    loginName: string;// todo rename to friendId? or friendProfileName -> use clientSocket.data.user for current user
}