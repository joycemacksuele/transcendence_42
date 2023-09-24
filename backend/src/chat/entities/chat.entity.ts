import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ChatType } from '../dto/create-chat.dto'

// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres

@Entity()
export class ChatEntity {

    @PrimaryGeneratedColumn()
    id?: number;	// ? is optional -> it will be created automatically

    @Column({
        type: "enum",
        enum: ChatType,
        default: ChatType.PUBLIC,
    })
    chatType: ChatType;

    // @Column("simple-json")
    // profile: { name: string; nickname: string }

    // @Column("simple-array")
    // names: string[]
}
