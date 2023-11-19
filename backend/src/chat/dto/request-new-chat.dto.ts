import {IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum, IsStrongPassword} from 'class-validator';
import {OneToMany} from "typeorm";
import {ChatType} from '../utils/chat-utils'
import {CreateUserDto} from "../../user/create-user.dto";

export class RequestNewChatDto {

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @IsNotEmpty({ message: 'Required' })
    chatName: string;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    // @IsNotEmpty({ message: 'Required' })
    @IsEnum(ChatType)
    chatType: ChatType;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    // @IsStrongPassword()
    @MinLength(5)
    @MaxLength(15)
    @IsOptional()
    chatPassword: string | null;

    // @IsNotEmpty({ message: 'Required' })

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    // @OneToMany(() => CreateUserDto, (createUserDto) => createUserDto.loginName)
    @IsNotEmpty({ message: 'Required' })
    loginName: string;
}
