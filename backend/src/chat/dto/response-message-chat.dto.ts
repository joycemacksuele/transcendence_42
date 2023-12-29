import {
    IsString,
    IsNumber
} from 'class-validator';

export class ResponseMessageChatDto {

    @IsNumber()
    id: number;

    @IsString()
    message: string;

    @IsString()
    creator: string;
}
