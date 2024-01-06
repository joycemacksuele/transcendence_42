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

    @IsEnum(ChatType)
    type: ChatType;

    @IsString()
    creator: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    admins: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    users: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    bannedUsers: string[];

    @IsArray()
    @ValidateNested({ each: true })
    messages: ResponseMessageChatDto[];

}
