import {IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum, IsStrongPassword, ValidateIf} from 'class-validator';
import {ChatType} from '../utils/chat-utils'

export class RequestNewChatDto {
    @IsEnum(ChatType)
    @IsNotEmpty()
    type: ChatType;
    
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    @IsNotEmpty()
    name: string;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    @ValidateIf((o) => o == ChatType.PROTECTED)
    @IsNotEmpty()
    @IsStrongPassword({ minNumbers: 1, minLength: 5, minUppercase: 1, minSymbols: 0, minLowercase: 1 })
    @MaxLength(15)
    password: string | null;
}
