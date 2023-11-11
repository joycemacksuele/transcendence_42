export interface ChatData {
    socketRoomId: string | undefined;
    name: string;// Can also be a login name
    type: ChatType;
    password: string;
}

export enum ChatType {
    PRIVATE = 0,// Max 2 people (DM)
    PUBLIC = 1,// Can have > 2
    PROTECTED = 2,// Can have > 2 AND has a password
}

// default ChatData