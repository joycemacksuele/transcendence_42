import {IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum, IsStrongPassword} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {ChatType} from '../utils/chat-utils'



// export const getCreateUserDto = (ApiPropertySwagger?: any) => {
//     // We did this to avoid having to include all nest dependencies related to ApiProperty on the client side too
//     // With this approach the value of this decorator will be injected by the server but wont affect the client
//     const ApiProperty = ApiPropertySwagger || function () {};


export class RequestNewChatDto {
    @IsEnum(ChatType)
    type: ChatType;
    
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    @IsNotEmpty({ message: 'Required' })
    name: string;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    // @IsNotEmpty({ message: 'Required' })

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    // @IsStrongPassword()
    @MinLength(5)
    @MaxLength(15)
    @IsOptional()
    password: string | null;

    // @IsString()
    // @MinLength(3)
    // @MaxLength(15)
    // @IsNotEmpty({ message: 'Required' })
    // loginName: string;// todo rename to friendId? or friendProfileName -> use clientSocket.data.user for current user
}
