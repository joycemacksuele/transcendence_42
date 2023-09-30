// chat-request
// chat-response

import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export enum ChatType {
    PUBLIC,
    PRIVATE,
    PROTECTED,//by a password
}

export class CreateChatDto {
    @IsNotEmpty({ message: 'Required' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    roomName: string;

    // @IsNotEmpty({ message: 'Required' })
    // roomId: number;

    // @IsNotEmpty({ message: 'Required' })
    // creatorId: number;

    // @IsNotEmpty({ message: 'Required' })
    // adminId: number;

    // @IsNotEmpty({ message: 'Required' })
    // roomType: ChatType;

    // Only has a password if its a type PROTECTED
    // @IsOptional()
    // @IsString()
    // @MinLength(5)
    // @MaxLength(10)
    // roomPassword: string;

    // @IsNotEmpty({ message: 'Required' })
    members: number[];
}
