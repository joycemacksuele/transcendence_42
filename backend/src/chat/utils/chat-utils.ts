export enum ChatType {
    PRIVATE = 0,// max 2 people (DM)
    PUBLIC = 1,// Can have > 2
    PROTECTED = 2,// Can have > 2 AND has a password
}