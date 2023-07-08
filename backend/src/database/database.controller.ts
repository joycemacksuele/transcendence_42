import { MyUser } from '../user/user.entity';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Console from "console"; // Replace with your own entity
import { UserRepository } from '../user/user.repository';

@Controller('database')
export class DatabaseController {
  constructor(
      @InjectRepository(MyUser)
      private readonly userRepository: UserRepository,
  ) {
    Console.log('[LOG] DatabaseController constructor');
  }

  @Get()
  async getDataFromDatabase() {
    Console.log('[LOG] getDataFromDatabase');
    const data = await this.userRepository.find(); // Perform a database query
    return data;
  }
}