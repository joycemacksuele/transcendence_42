import {Logger, Module} from '@nestjs/common'
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { TwoFactorAuthController } from './2fa.controller';
import { TwoFactorAuthService } from './2fa.service';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),
    MailerModule.forRoot({
        transport: {
            host: `${process.env.EHOST}`,
            port: `${process.env.EPORT}`,
            // service: 'gmail',
            secure: true,
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.APASS}`,

            }
        },
    })],   
    controllers: [TwoFactorAuthController],    
    providers: [TwoFactorAuthService, AuthService, JwtService, UserService],
})
export class TwoFactorAuthModule {
    private readonly logger = new Logger(TwoFactorAuthModule.name);
    constructor() {
        this.logger.log('constructor');
    }
}
