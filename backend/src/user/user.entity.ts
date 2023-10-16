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

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {// Joyce -> I named it from MyUser to UserEntity because it was tricky for me to remember that the MyUser keyword was an entity -> we can change it back later if you want
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
}
