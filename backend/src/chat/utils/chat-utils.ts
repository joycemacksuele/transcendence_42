export enum ChatType {
    PRIVATE = 0,// max 2 people (DM)
    PUBLIC,// Can have > 2
    PROTECTED,// Can have > 2 AND has a password
}