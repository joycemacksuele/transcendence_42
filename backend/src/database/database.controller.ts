import { MyUser } from '../user/user.entity';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Console from "console"; // Replace with your own entity

@Controller('database')
export class DatabaseController {
  constructor(
    @InjectRepository(MyUser)
    private readonly MyUserRepository: Repository<MyUser>,
  ) {
    Console.log('[LOG] DatabaseController constructor');
  }

  @Get()
  async getDataFromDatabase() {
    Console.log('[LOG] getDataFromDatabase');
    const data = await this.MyUserRepository.find(); // Perform a database query
    return data;
  }
}