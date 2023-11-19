import {Logger, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';

import { Friendship } from '../friendships/friendship.entity';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, Friendship])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {
    private readonly logger = new Logger(UserModule.name);
    constructor() {
        this.logger.log('constructor');
    }
}
