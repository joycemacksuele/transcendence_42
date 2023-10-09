// chat-request
// chat-response

import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export enum RoomType {
    PRIVATE = 0,// max 2 people (DM)
    PUBLIC,// Can have > 2
    PROTECTED,//Can have > 2 AND has a password
}

export class CreateChatDto {

    @IsNotEmpty({ message: 'Required' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    roomName: string;

    // @IsNotEmpty({ message: 'Required' })
    // creatorId: number;// We can get from the backend since its the current user

    // @IsNotEmpty({ message: 'Required' })
    // adminId: number;// We can get from the backend since its the current user

    @IsNotEmpty({ message: 'Required' })
    roomType: RoomType;

    // Only has a password if its a type PROTECTED
    // it has to be hashed before saved to the database
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    roomPassword: string;

    // @IsNotEmpty({ message: 'Required' })
    // roomMembers: number[];// nt in the create room screen
}
