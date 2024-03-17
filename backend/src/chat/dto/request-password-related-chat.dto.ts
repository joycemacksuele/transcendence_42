import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    MaxLength,
    IsStrongPassword,
    ValidateIf,
    IsNumber
} from 'class-validator';
import {ChatType} from '../utils/chat-utils'

export class RequestPasswordRelatedChatDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    @IsNotEmpty()
    name: string;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minNumbers: 1, minLength: 5, minUppercase: 1, minSymbols: 0, minLowercase: 1 }, { message: 'password is not following the rules' })
    @MaxLength(15)
    password: string;
}
