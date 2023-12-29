import {
    IsString,
    IsEnum,
    IsNumber,
    IsStrongPassword,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    MinLength, MaxLength, IsNotEmpty
} from 'class-validator';
import {ChatType} from '../utils/chat-utils'
import {ResponseMessageChatDto} from "./response-message-chat.dto";

export class ResponseNewChatDto {

    @IsNumber()
    id: number;

    @IsString()
    name: string;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    @IsEnum(ChatType)
    type: ChatType;

    @IsString()
    creator: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    admins: string[];

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    // @IsString()
    // @IsOptional()
    // @IsStrongPassword()
    // password: string | undefined;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    users: string[];

    @IsArray()
    @ValidateNested({ each: true })
    messages: ResponseMessageChatDto[];

}
