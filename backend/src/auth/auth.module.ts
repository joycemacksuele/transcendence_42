import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
<<<<<<< HEAD
import { UserService } from 'src/user/user.service';
import { TwoFactorAuthService } from './2fa/2fa.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyUser } from 'src/user/user.entity';


@Module({
  imports: [
  JwtModule.register({
    global: true,
  }), 
  UserModule, 
  TypeOrmModule.forFeature([MyUser])],

  controllers: [AuthController],
  
  providers: [
  AuthService,
  {
    provide: APP_GUARD,
    useClass: AuthGuard, 
  }, 
  UserService, 
  TwoFactorAuthService,],
=======

@Module({
  imports: [JwtModule.register({
    global: true
  })],

  controllers: [AuthController],
  
  providers: [AuthService,
  {
    provide: APP_GUARD,
    useClass: AuthGuard, 
  }],
>>>>>>> jaka
})
export class AuthModule {
  constructor() {
    console.log('[BACKEND LOG] AuthModule constructor');
  }
}
