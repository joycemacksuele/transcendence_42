import {Logger, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { TwoFactorAuthService } from './2fa/2fa.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [
  JwtModule.register({
    global: true,
    secret: process.env.secret
  }), 
  UserModule, 
  TypeOrmModule.forFeature([UserEntity])],

  controllers: [AuthController],
  
  providers: [
  AuthService,
  // {
  //   provide: APP_GUARD,
  //   useClass: AuthGuard, 
  // }, 
  UserService, 
  TwoFactorAuthService,
  ],

  exports: [AuthService]
})

export class AuthModule {
  private readonly logger = new Logger(AuthModule.name);
  constructor() {
    this.logger.log('constructor');
  }
}
