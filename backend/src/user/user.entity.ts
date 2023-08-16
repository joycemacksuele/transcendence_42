/*
	Added jaka:
	@Entity is a 'decorator'

	In Nest.js with TypeORM, the @Entity() decorator is used to mark a class as an entity, representing a database table. It is imported from the typeorm package.

	When you apply the @Entity() decorator to a class, you are defining that class as a TypeORM entity. TypeORM entities are JavaScript/TypeScript classes that map to database tables. They define the structure and behavior of the tables in your database
	It says that a class is an entity, representing a database table.

	The user.entity.ts file represents the entity model for your user in the database. It defines the structure of the user entity, including the table name, columns, and their types. This file is responsible for mapping the database table to the object-oriented entity representation.

*/


import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MyUser {
	constructor() {
		console.log('[BACKEND LOG] MyUser constructor');
	}

	@PrimaryGeneratedColumn()
	id?: number;	// ? is optional -> it will be created automatically

	@Column()
	loginName: string;

	@Column({default: 'default profile name'})
	profileName: string;

	@Column({default: 'some path'})
	profileImage?: string;
}
