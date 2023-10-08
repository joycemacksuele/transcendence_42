/*
	Defining the 'UserService' class and implementing the necessary methods for handling user-related operations.
	The UserService class is defined as an 'injectable provider' ???, using the @Injectable() decorator.
	The class has a constructor that injects the User repository, which is obtained using the
	@InjectRepository(UserEntity) decorator.

  The functions that access data are better located in the file user.repository
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { Repository, FindOneOptions } from 'typeorm';
import { createWriteStream } from 'fs';   // added jaka, to save the orig user image to folder ./uploads
import axios from 'axios';


@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      public readonly userRepository: UserRepository,
      // private userRepository: Repository<UserEntity>,
      // public readonly justRepository: Repository<UserEntity>
  ) {
      console.log('[BACKEND LOG] UserService constructor');
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    console.log('[BACKEND LOG] UserService.createUser');
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async deleteAllUsers(): Promise<void> {
    console.log('[BACKEND LOG] UserService.deleteAllUsers');
    try {
      await this.userRepository.clear();
      console.log('[BACKEND LOG] from nest user.service: All users deleted.');
    } catch (error) {
      console.error('[BACKEND LOG] from nest user.service: Error deleting all users.', error);
      // throw new InternalServerErrorException('Unable to delete all users');
    }
  }

  // async deleteDummies(): Promise<void> {
  //   console.log('[BACKEND LOG] UserService.deleteDummies');
  //   try {
  //     await this.userRepository.delete({ profileName: 'dummy' });
  //     console.log('[BACKEND LOG] from nest user.service: All dummy users deleted.');
  //   }
  //   catch (error) {
  //     console.error('[BACKEND LOG] from nest user.service: Error deleting dummy users.', error);
  //     // throw new InternalServerErrorException('Unable to delete dummy users');
  //   }
  // }

  async getAllUsers(): Promise<UserEntity[]> {
    console.log('[BACKEND LOG] UserService.getAllUsers');
    return this.userRepository.find();
    // return this.userRepository.getAllUsers();
  }


  async getUserByLoginName(loginName: string): Promise<UserEntity> {
    const options: FindOneOptions<UserEntity> = { where: { loginName } };
	  return this.userRepository.findOne( options );
  }

  async getUserByProfileName(profileName: string): Promise<UserEntity> {
    const options: FindOneOptions<UserEntity> = { where: { profileName } };
	  return this.userRepository.findOne( options );
  }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async updateProfileImage(loginName: string, profileImage: string) {
    await this.userRepository.update({ loginName} , { profileImage });
  }

  async updateStoredTFACode(loginName: string, tfaCode: string) {
    await this.userRepository.update({ loginName} , { tfaCode });
  }

  async enableTFA(loginName: string, tfaEnabled: boolean) {
    await this.userRepository.update({ loginName} , { tfaEnabled });
  }

  // added jaka:
  async downloadAndSaveImage(imageUrl: string, savePath: string): Promise<void> {
    const writer = createWriteStream(savePath); 

    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  // async findById(id: number): Promise<UserEntity | undefined> {
  //   console.log('[BACKEND LOG] UserService.getUserById');
  //   return this.userRepository.findById(id);
  // }



  // async getUserById(id: number): Promise<UserEntity> {
  //   return this.userRepository.findOne({ where: { id} });
  // }

  // async updateUser(id: number, updateUserDto: CreateUserDto): Promise<UserEntity> {
  //   await this.userRepository.update(id, updateUserDto);
  //   return this.userRepository.findOne({ where: { id } });
  // }

  // async deleteUser(id: number): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
}
