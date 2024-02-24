/*
	@Entity is a 'decorator' used to mark a class as an entity, representing a database table.
	In Nest.js, Entity is imported from the TypeORM package.

	When you apply the @Entity() decorator to a class, you are defining that class as a TypeORM entity.
	TypeORM entities are JavaScript/TypeScript classes that map to database tables.
	They define the structure and behavior of the tables in your database.
	It says that a class is an entity, representing a database table.

	The user.entity.ts file represents the entity model for your user in the database.
	It defines the structure of the user entity, including the table name, columns, and their types.
	This file is responsible for mapping the database table to the object-oriented entity representation.
	Each entity has its own repository.
*/

import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable} from 'typeorm';
import { Friendship } from 'src/friendships/friendship.entity';
import { Blockship } from 'src/blockShips/blockship.entity';
import { ChatMessageEntity } from 'src/chat/entities/chat-message.entity';
import { NewChatEntity } from 'src/chat/entities/new-chat.entity';
import { MutedEntity } from "../chat/entities/muted.entity";


@Entity()
export class UserEntity {

	@PrimaryGeneratedColumn()
	id?: number;	// ? is optional -> it will be created automatically

	@Column()
	loginName: string;

	@Column({default: 'default profile name'})
	profileName: string;

	@Column({default: '../utils/resources/no-picture.png'})
	profileImage?: string;
	// static async updateProfileImage(id: number, profileImage: string) {
	// 	await this.update(id, { profileImage });
	// }

	@Column()
	intraId: number;

	@Column({default: 'default some email'})
	email: string;

	@Column({default: false})
	onlineStatus: boolean;

	@Column({default: 0})
	rank: number;

	@Column({default: 0})
	gamesPlayed: number;

	@Column({default: 0})
	gamesWon: number;
	
	@Column({default: 0})
	gamesLost: number;

	@Column({default: 'Lazy Lamb'})
	achievements: string;

	@Column()
	hashedSecret: string;

	@Column({default: 'default'})
	refreshToken: string;

	@Column({default: false})
	tfaEnabled: boolean;

	@Column({default: 'default'})
	tfaCode: string;

	@Column({default: false})
	tfaVerified: boolean;

	@Column({default: true})
	isFirstLogin: boolean;

	/* @OneToMany()  Is a decorator from TypeORM
		A User entity can have friends - can be associated with multiple instances of Friendship entity.

		It takes 2 functions as arguments:
			- 'target entity' and 'inverse side property'

						TARGET,				INVERSE SIDE            
			@OneToMany(	() => Friendship,   (friendship) => friendship.user)

			TARGET:	() => Friendship
			Returns the type of target entity: Friendship
			This informs TypeORM about the entity on the other side of relationship.

			INVERSE SIDE:	(friendship) => friendship.user)
			The Friendship entity has a property/column 'user'.
			This represents the other side of relationship, from the perspective of the targeted Friendship entity.
			This function returns the property 'user' of the target entity. 
	*/
	@OneToMany(() => Friendship, (friendship) => friendship.user)
	friendships: Friendship[] | null;

	// @OneToMany(() => Friendship, (friendship) => friendship.friend)
	// friendOf: Friendship[];

	@OneToMany(() => ChatMessageEntity, (chatMessage) => chatMessage.creator)
	chatMessages: ChatMessageEntity[] | null;

	// This 2nd argument:
	//		(blockship) => blockship.blocker)
	// 		This links the 'blockedUsers' array in UserEntity to the 'blocker' field in Blockship entities.
	// 		It means that the 'blocker' in Blockship refers to this UserEntity, so fetching all 
	//		Blockships where this user has blocked someone.
	@OneToMany(() => Blockship, (blockship) => blockship.blocker)
	blockedUsers: Blockship [];

	// Array of users that blocked this user
	// @OneToMany(() => Blockship, (blockship) => blockship.blocked)
	// meBlockedByOthers: Blockship [];
	@OneToMany(() => NewChatEntity, (newChat) => newChat.creator)
	roomsCreated: NewChatEntity[];

	@OneToMany(() => MutedEntity, (muted) => muted.user)
	@JoinTable()
	canChat: MutedEntity[];
}
