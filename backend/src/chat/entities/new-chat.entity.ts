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

    @Column({
        type: "enum",
        enum: ChatType,
        default: ChatType.PUBLIC,
    })
    chatType: ChatType;

    // it has to be hashed before saved to the database
    @Column()
    chatPassword: string;

    @Column("simple-array")
    chatMembers: number[]

    // @Column("simple-json")
    // profile: { name: string; nickname: string }

    // @Column("simple-array")
    // names: string[]
}
