import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ChatType } from '../utils/chat-utils'

export class RequestNewChatDto {

    @IsNotEmpty({ message: 'Required' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    chatName: string;

    // @IsNotEmpty({ message: 'Required' })
    // creatorId: number;// We can get from the backend since its the current user

    // @IsNotEmpty({ message: 'Required' })
    // adminId: number;// We can get from the backend since its the current user

    @IsNotEmpty({ message: 'Required' })
    chatType: ChatType;

    // Only has a password if its a type PROTECTED
    // it has to be hashed before saved to the database
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    chatPassword: string;

    // @IsNotEmpty({ message: 'Required' })
    // chatMembers: number[];// not in the create chat screen
}
