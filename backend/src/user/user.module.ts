import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { DuplicateService } from 'src/duplicate/duplicate.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TwoFactorAuthService } from 'src/auth/2fa/2fa.service';

import { Friendship } from '../friendships/friendship.entity';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, Friendship])],
    providers: [UserService, DuplicateService, AuthService, JwtService, TwoFactorAuthService],
    controllers: [UserController],
})
export class UserModule {
    constructor() {
        console.log('[BACKEND LOG] UserModule constructor');
    }
}
