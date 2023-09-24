import { Module } from '@nestjs/common'
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { TwoFactorAuthController } from './2fa.controller';
import { TwoFactorAuthService } from './2fa.service';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
    imports: [MailerModule.forRoot({
        transport: {
            host: 'smtp.gmail.com',
            auth: {
                user: 'email address',
                pass: 'password',
            }
        },
    }), TypeOrmModule.forFeature([UserEntity])],
  
    controllers: [TwoFactorAuthController],
    
    providers: [TwoFactorAuthService, AuthService, JwtService, UserService, ],
})
export class TwoFactorAuthModule {
    constructor() {
        console.log('[BACKEND LOG] TwoFactorAuthModule constructor');
    }
}
