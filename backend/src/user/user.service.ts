/*
	Defining the 'UserService' class and implementing the necessary methods for handling user-related operations.
	The UserService class is defined as an 'injectable provider' ???, using the @Injectable() decorator.
	The class has a constructor that injects the User repository, which is obtained using the
	@InjectRepository(User) decorator.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Console from "console";
import { CreateUserDto } from './create-user.dto';
import { MyUser } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    // private userRepository: Repository<MyUser>,
    public readonly userRepository: UserRepository
  ) {
    Console.log('[LOG] UserService constructor');
  }

  async createUser(createUserDto: CreateUserDto): Promise<MyUser> {
    Console.log('[LOG] createUser');
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<MyUser[]> {
    Console.log('[LOG] getAllUsers');
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<MyUser> {
    return this.userRepository.findById(id);
  }

  async deleteAllUsers(): Promise<void> {
    try {
      await this.userRepository.clear();
      console.log('[LOG] from nest user.service: All users deleted.');
    } catch (error) {
      console.error('[LOG] from nest user.service: Error deleting all users.', error);
      // throw new InternalServerErrorException('Unable to delete all users');
    }
  }

  // async getUserById(id: number): Promise<MyUser> {
  //   return this.userRepository.findOne({ where: { id} });
  // }

  // async updateUser(id: number, updateUserDto: CreateUserDto): Promise<MyUser> {
  //   await this.userRepository.update(id, updateUserDto);
  //   return this.userRepository.findOne({ where: { id } });
  // }

  // async deleteUser(id: number): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
}