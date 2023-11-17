import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ChatType } from '../utils/chat-utils'

// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
// Entity reflects exactly one table in the database

@Entity()
export class NewChatEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    chatName: string;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    @Column({
        type: "enum",
        enum: ChatType,
        default: ChatType.PUBLIC,
    })
    chatType: ChatType;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    @Column({
        nullable: true,
    })
    chatPassword: string;

    // the creator can kick, ban, mute anyone on the channel (even admins)
    @Column({
        nullable: true,
    })
    chatCreator: string;

    // when the group is created, the admin is the owner (creator)
    // later on in another screen the admin will be able to add more admins to the room
    // the admin can kick, ban, mute others on the channel (besides the creator)
    @Column({
        type: "simple-json",
        nullable: true,
    })
    chatAdmins: string[]

    // it includes the current user
    @Column({
        type: "simple-json",
        nullable: true,
    })
    chatMembers: string[]

    // @Column("simple-array")
    // chatBannedUsers: number[]
}
