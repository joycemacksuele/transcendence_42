/*
	Defining the 'UserService' class and implementing the necessary methods for handling user-related operations. 

	The UserService class is defined as an 'injectable provider' ???, using the @Injectable() decorator. The class has a constructor that injects the User repository, which is obtained using the @InjectRepository(User) decorator.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { myUser } from './user.entity';
import Console from "console";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(myUser)
    private userRepository: Repository<myUser>,
  ) {
    Console.log('LOG UserService constructor');
  }

  async createUser(createUserDto: CreateUserDto): Promise<myUser> {
    Console.log('LOG createUser');
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getUsers(): Promise<myUser[]> {
    Console.log('LOG getUsers');
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<myUser> {
    return this.userRepository.findOne({ where: { id} });
  }

  async updateUser(id: number, updateUserDto: CreateUserDto): Promise<myUser> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}