import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
})
export class AuthModule {}
