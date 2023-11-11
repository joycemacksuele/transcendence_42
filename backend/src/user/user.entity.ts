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

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Friendship } from 'src/friendships/friendship.entity';

@Entity()
export class UserEntity {
	constructor() {
		console.log('[BACKEND LOG] UserEntity constructor');
	}
	
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

	@Column()
	hashedSecret: string;

	@Column({default: false})
	tfaEnabled: boolean;

	@Column({default: 'default'})
	tfaCode: string;

	// Chat related
	// @Column({type: json})
	@Column({type: "integer", array: true})
	roomsCreated: number[];


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
			The Frienship entity has a property/column 'user'. This represents the other side of relationship, from the perspective of the targeted Friendship entity.
			This function returns the property 'user' of the target entity. 
	*/
	@OneToMany(() => Friendship, (friendship) => friendship.user)
	friendships: Friendship[];

	// @OneToMany(() => Friendship, (friendship) => friendship.friend)
	// friendOf: Friendship[];
}
