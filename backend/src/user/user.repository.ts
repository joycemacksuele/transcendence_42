/*
	In your UserRepository class, you can add custom methods to extend the functionality provided by the Repository class from TypeORM. These custom methods can be used to perform additional database operations specific to the User entity.
*/

import { Repository, FindOneOptions } from 'typeorm';
import { myUser } from './user.entity';
import Console from "console";
import {InjectRepository} from "@nestjs/typeorm";

export class UserRepository extends Repository<myUser> {
	
	// Added custom methods:
	// Find users by their email, fetch users based on specific criteria, or perform complex database queries related to users.
	async findByName(name: string): Promise<myUser | undefined> {
		Console.log('LOG findByName');
		const options: FindOneOptions<myUser> = { where: { name } };
		return this.findOne( options );
	}

	async findById(id: number): Promise<myUser | undefined> {
		Console.log('LOG findByName');
		const options: FindOneOptions<myUser> = { where: { id } };
		return this.findOne( options );
	}
}
