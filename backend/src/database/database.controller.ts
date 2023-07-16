import { MyUser } from '../user/user.entity';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user/user.repository';

@Controller('database')
export class DatabaseController {
  constructor(
      @InjectRepository(MyUser)
      private readonly userRepository: UserRepository,
  ) {
    console.log('[LOG] DatabaseController constructor');
  }

  @Get()
  async getDataFromDatabase() {
    console.log('[LOG] getDataFromDatabase');
    const data = await this.userRepository.find(); // Perform a database query
    return data;
  }
}