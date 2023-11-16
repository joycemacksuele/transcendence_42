import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
// Entity reflects exactly one table in the database

@Entity()
export class NewChatEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    chatName: string;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    @Column()
    chatPassword: string | undefined;

    // the creator can kick, ban, mute anyone on the channel (even admins)
    @Column()
    chatCreator: string;

    // when the group is created, the admin is the owner (creator)
    // later on in another screen the admin will be able to add more admins to the room
    // the admin can kick, ban, mute others on the channel (besides the creator)
    @Column("simple-json")
    chatAdmins: string[]

    // it includes the current user
    @Column("simple-json")
    chatMembers: string[]

    // @Column("simple-array")
    // chatBannedUsers: number[]
}
