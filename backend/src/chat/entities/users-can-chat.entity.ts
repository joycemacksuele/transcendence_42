import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { NewChatEntity } from "./new-chat.entity";

@Entity()
export class UsersCanChatEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.canChat, {
		onDelete: 'CASCADE',
	})
    user: UserEntity;

    @ManyToOne(() => NewChatEntity, (chat) => chat.usersCanChat, {
		onDelete: 'CASCADE',
	})
    chat: NewChatEntity;

    @Column({type: "bigint"})
    timeStamp: string;
}
