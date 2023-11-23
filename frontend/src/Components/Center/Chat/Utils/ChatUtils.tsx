// This is mapped to request-new-chat.dto.ts on the backend
export interface RequestNewChatDto {
    // socketId: string;
    chatName: string;// Can also be a login name
    chatType: ChatType;
    chatPassword: string | null;
    loginName: string;
}

// This is mapped to response-new-chat.dto.ts on the backend
export interface ResponseNewChatDto {
    id: number;
    chatName: string;// Can also be a login name
    chatType: ChatType;
    // chatPassword: string | null;
    chatMembers: string[];
}

export enum ChatType {
    PRIVATE = 0,// Max 2 people (DM)
    PUBLIC = 1,// Can have > 2
    PROTECTED = 2,// Can have > 2 AND has a password
}
