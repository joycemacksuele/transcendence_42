import { UserEntity } from '../user/user.entity';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user/user.repository';

@Controller('database')
export class DatabaseController {
  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: UserRepository,
  ) {
    console.log('[BACKEND LOG] DatabaseController constructor');
  }

  @Get()
  async getDataFromDatabase() {
    console.log('[BACKEND LOG] getDataFromDatabase');
    const data = await this.userRepository.find(); // Perform a database query
    return data;
  }
}