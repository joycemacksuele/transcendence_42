/*
	In your UserRepository class, you can add custom methods to extend the functionality provided by the Repository
	class from TypeORM. These custom methods can be used to perform additional database operations specific to
	the UserEntity.
*/

import {Injectable, Logger} from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
	private readonly logger = new Logger(UserRepository.name);
	constructor() {
		// @ts-ignore
		super();
		this.logger.log('constructor');
	}

	
	// Added custom methods:
	// Find users by their email, fetch users based on specific criteria, or perform complex database queries related to users.
	// async findByName(name: string): Promise<UserEntity | undefined> {
	// 	console.log('[BACKEND LOG] findByName');
	// 	const options: FindOneOptions<UserEntity> = { where: { name } };
	// 	return this.findOne( options );
	// }

	// async findById(id: number): Promise<UserEntity | undefined> {
	// 	console.log('[BACKEND LOG] findById');
	// 	const options: FindOneOptions<UserEntity> = { where: { id } };
	// 	return this.findOne( options );
	// }

	// async getAllUsers(): Promise<UserEntity[]> {
	// 	console.log('[BACKEND LOG] UserService.getAllUsers');
	// 	return this.find();
	//   }
}
