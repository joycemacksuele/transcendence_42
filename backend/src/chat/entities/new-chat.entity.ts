import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, Unique } from 'typeorm';
import { ChatType } from '../utils/chat-utils';
import { ChatMessageEntity } from 'src/chat/entities/chat-message.entity';
import { UserEntity } from 'src/user/user.entity';

// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
// Entity reflects exactly one table in the database

@Entity()
@Unique(['name'])
export class NewChatEntity {

    // JOYCE -> I have added uuid to try to fix a database error with the ids
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    // PRIVATE   | is a DM - can't be joined  | only members can see it
    // PUBLIC    | everyone can join it       | everyone can see it
    // PROTECTED | password to join           | everyone can see it
    @Column({
        type: "enum",
        enum: ChatType,
        default: ChatType.PUBLIC,
    })
    type: ChatType;

    // if chatType == PROTECTED
    // it has to be hashed before saved to the database
    @Column({
        nullable: true,
    })
    password: string;

    // the creator can kick, ban, mute anyone on the channel (even admins)
    @ManyToOne(() => UserEntity, (user) => user.rooms_created)
    creator: UserEntity;

    // when the group is created, the admin is the owner (creator)
    // later on in another screen the admin will be able to add more admins to the room
    // the admin can kick, ban, mute others on the channel (besides the creator)
    @ManyToMany(() => UserEntity)
    @JoinTable()
    admins: UserEntity[];

    // it includes the current user
    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    bannedUsers: UserEntity[];

    @OneToMany(() => ChatMessageEntity, (chatmessage) => chatmessage.chatbox)
    messages: ChatMessageEntity[];
}
