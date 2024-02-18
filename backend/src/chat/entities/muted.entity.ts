import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { NewChatEntity } from "./new-chat.entity";

@Entity()
export class MutedEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.canChat)
    user: UserEntity;

    @ManyToOne(() => NewChatEntity, (chat) => chat.usersCanChat)
    chat: NewChatEntity;

    @Column({type: "bigint"})
    timeStamp: string;
}
