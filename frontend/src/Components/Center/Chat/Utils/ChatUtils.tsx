// This is mapped to request-new-chat.dto.ts on the backend
export interface RequestNewChatDto {
    // socketId: string;
    name: string;// Can also be a login name
    type: ChatType;
    password: string | null;
    loginName: string;
}

// This is mapped to response-new-chat.dto.ts on the backend
export interface ResponseNewChatDto {
    id: number;
    name: string;// Can also be a login name
    type: ChatType;
    creator: string;
    admins: string[];
    users: string[];
}

export enum ChatType {
    PRIVATE = 0,// Max 2 people (DM)
    PUBLIC = 1,// Can have > 2
    PROTECTED = 2,// Can have > 2 AND has a password
}
