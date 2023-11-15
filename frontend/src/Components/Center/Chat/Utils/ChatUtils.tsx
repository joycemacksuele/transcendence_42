export interface RequestNewChatDto {
    socketId: string;
    chatName: string;// Can also be a login name
    chaType: ChatType;
    chatPassword: string | undefined;
    loginName: string | undefined;
}

export enum ChatType {
    PRIVATE = 0,// Max 2 people (DM)
    PUBLIC = 1,// Can have > 2
    PROTECTED = 2,// Can have > 2 AND has a password
}

// default ChatData