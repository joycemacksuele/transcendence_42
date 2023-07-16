/*
	In your UserRepository class, you can add custom methods to extend the functionality provided by the Repository
	class from TypeORM. These custom methods can be used to perform additional database operations specific to
	the User entity.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOneOptions } from 'typeorm';
import { MyUser } from './user.entity';

@Injectable()
export class UserRepository extends Repository<MyUser> {

	constructor() {
		console.log('[LOG] UserRepository constructor');
		// @ts-ignore
		super();
	}
	
	// Added custom methods:
	// Find users by their email, fetch users based on specific criteria, or perform complex database queries related to users.
	async findByName(name: string): Promise<MyUser | undefined> {
		console.log('[LOG] findByName');
		const options: FindOneOptions<MyUser> = { where: { name } };
		return this.findOne( options );
	}

	async findById(id: number): Promise<MyUser | undefined> {
		console.log('[LOG] findById');
		const options: FindOneOptions<MyUser> = { where: { id } };
		return this.findOne( options );
	}
}
