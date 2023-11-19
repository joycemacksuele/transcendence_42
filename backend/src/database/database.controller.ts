import { UserEntity } from '../user/user.entity';
import {Controller, Get, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user/user.repository';

@Controller('database')
export class DatabaseController {

  private readonly logger = new Logger(DatabaseController.name);

  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: UserRepository,
  ) {
    this.logger.log('constructor');
  }

  @Get()
  async getDataFromDatabase() {
    this.logger.log('getDataFromDatabase');
    return await this.userRepository.find(); // Perform a database query
  }
}