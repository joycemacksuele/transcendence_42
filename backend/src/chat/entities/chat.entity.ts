import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RoomType } from '../dto/create-chat.dto'

// Read: https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
// Entity reflects exactly one table in the database

@Entity()
export class ChatEntity {

    @PrimaryGeneratedColumn()
    id?: number;	// ? is optional -> it will be created automatically

    @Column({
        type: "enum",
        enum: RoomType,
        default: RoomType.PUBLIC,
    })
    roomType: RoomType;

    // @Column("simple-json")
    // profile: { name: string; nickname: string }

    // @Column("simple-array")
    // names: string[]
}
