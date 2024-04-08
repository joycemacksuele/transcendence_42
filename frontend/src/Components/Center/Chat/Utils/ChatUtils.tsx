export interface RequestNewChatDto {
    name: string;// Can also be a login name for a private chat
    type: ChatType;
    password: string | null;
}

export interface ResponseMessageChatDto {
    id: number;
    message: string;
    creator: string;
    creator_id: number; // added jaka
}

// This is mapped to response-new-chat.dto.ts on the backend
export interface ResponseNewChatDto {
    id: number;
    name: string;// Can also be a login name for the PRIVATE messages
    type: ChatType;
    creator: string;
    admins: string[];
    usersIntraName: string[];
    usersProfileName: string[];
    mutedUsers: string[];
    bannedUsers: string[];
    messages: ResponseMessageChatDto[] | null;
}

export enum ChatType {
    PRIVATE = 0,// Max 2 people (DM)
    PUBLIC = 1,// Can have > 2
    PROTECTED = 2,// Can have > 2 AND has a password
}
