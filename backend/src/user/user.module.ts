import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { MyUser } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MyUser])],

  controllers: [UserController],
  
  providers: [UserService],
})
export class UserModule {
  constructor() {
    console.log('[BACKEND LOG] UserModule constructor');
  }
}
