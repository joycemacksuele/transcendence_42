import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { ChatType } from '../utils/chat-utils';
import { ChatMessageEntity } from 'src/chat/entities/chat-message.entity';
import { UserEntity } from 'src/user/user.entity';

// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
// Entity reflects exactly one table in the database

@Entity()
export class NewChatEntity {

    @PrimaryGeneratedColumn()
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
    // @Column({
    //     nullable: true,
    // })
    // creator: string;

    // when the group is created, the admin is the owner (creator)
    // later on in another screen the admin will be able to add more admins to the room
    // the admin can kick, ban, mute others on the channel (besides the creator)
    @ManyToMany(() => UserEntity)
    @JoinTable()
    admins: UserEntity[];
    // @Column({
    //     type: "simple-json",
    //     nullable: true,
    // })
    // admins: string[];

    // it includes the current user
    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];
    // @Column({
    //     type: "simple-json",
    //     nullable: true,
    // })
    // users: string[];

    @OneToMany(() => ChatMessageEntity, (chatmessage) => chatmessage.chatbox)
    messages: ChatMessageEntity[];
}
