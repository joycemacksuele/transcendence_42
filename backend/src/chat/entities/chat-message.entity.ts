import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NewChatEntity } from 'src/chat/entities/new-chat.entity';
import { UserEntity } from 'src/user/user.entity';
// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
// Entity reflects exactly one table in the database

@Entity()
export class ChatMessageEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    message: string;

    @ManyToOne(() => UserEntity, (user) => user.chatmessages)
    creator: UserEntity;

    @ManyToOne(() => NewChatEntity, (newchat) => newchat.messages)
    chatbox: NewChatEntity;
}
