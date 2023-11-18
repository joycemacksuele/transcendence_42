import {IsNotEmpty, IsOptional, IsString, MinLength, MaxLength} from 'class-validator';

export class RequestMessageChatDto {

/*    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @IsNotEmpty({ message: 'Required' })
    chatName: string;
*/
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    @IsOptional()
    chatPassword: string | undefined;

    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @IsNotEmpty({ message: 'Required' })
    loginName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    @IsNotEmpty({ message: 'Required' })
    message: string;
}