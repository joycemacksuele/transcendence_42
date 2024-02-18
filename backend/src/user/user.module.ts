import {Logger, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { DuplicateService } from 'src/duplicate/duplicate.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TwoFactorAuthService } from 'src/auth/2fa/2fa.service';

import { Friendship } from '../friendships/friendship.entity';
import { Blockship } from 'src/blockShips/blockship.entity';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, Friendship, Blockship])],
    providers: [UserService, DuplicateService, AuthService, JwtService, TwoFactorAuthService],
    controllers: [UserController],
    exports: [UserService]      // added Jaka, to be able to use it in the Blockhip controller
})
export class UserModule {
    private readonly logger = new Logger(UserModule.name);
    constructor() {
        this.logger.log('constructor');
    }
}
