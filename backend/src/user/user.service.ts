/*
	Defining the 'UserService' class and implementing the necessary methods for handling user-related operations.
	The UserService class is defined as an 'injectable provider' ???, using the @Injectable() decorator.
	The class has a constructor that injects the User repository, which is obtained using the
	@InjectRepository(UserEntity) decorator.

  The functions that access data are better located in the file user.repository
*/

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { Repository, FindOneOptions } from 'typeorm';
import { createWriteStream } from 'fs';   // added jaka, to save the orig user image to folder ./uploads
import { Like } from 'typeorm';
import axios from 'axios';


@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
      @InjectRepository(UserEntity)
      public readonly userRepository: UserRepository,
      // private userRepository: Repository<UserEntity>,
      // public readonly justRepository: Repository<UserEntity>
  ) {
      this.logger.log('constructor');
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log('createUser');
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async deleteDummies(): Promise<void> {
    this.logger.log('deleteDummies');
    try {
      await this.userRepository.delete({ profileName: Like ('%dummy%') });
      await this.userRepository.delete({ loginName: Like ('%dummy%') });  // Jaka: Temporary, until the 'change name' bug is solved
      this.logger.log('All dummy users deleted.');
    }
    catch (error) {
      this.logger.error('Error deleting dummy users.', error);
      // throw new InternalServerErrorException('Unable to delete dummy users');
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    this.logger.log('getAllUsers');
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
    // this.logger.log('updateStoredTFACode function before: ' + this.userRepository.findOne("tfaCode"));

    const response = await this.userRepository.update({ loginName} , { tfaCode });
    this.logger.log('updateStoredTFACode function after: ' + tfaCode);
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

  async setOnlineStatus(loginName: string, status: boolean) {

    const optionsObject: FindOneOptions<UserEntity> = { where: { loginName }  };
 
    const user = await this.userRepository.findOne(optionsObject);
    
    if (user) {
      user.onlineStatus = status;
      console.log("setOnlineStatus(): ", user.onlineStatus);
      await this.userRepository.save(user);
    } else {
      throw new NotFoundException(`User with login name ${loginName} not found`);
    }
  }


  // async findById(id: number): Promise<UserEntity | undefined> {
  //   this.logger.log('getUserById');
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
