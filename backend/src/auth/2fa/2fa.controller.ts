import { Body, Controller, Get, Post, Request, Response, HttpException, HttpStatus } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { TwoFactorAuthService } from "./2fa.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";

@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly tfaService: TwoFactorAuthService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService, 
        ) {}
    logger: Logger = new Logger('2FA mail controller');

    // use guard as this is done after the authorization is completed 
    // once the user clicks send on the screen with the 2fa code this does GET http:localhost:3001/2fa/profile

    @Post('verify_code')
    async verifyTwoFactorAuthentification(@Body() body: any, @Request() request: any, @Response() response: any){
        try{
            const codeToVerify = body['tfaCode'];
            let player = await this.userService.getUserByLoginName(request.loginName);
            const codeStored = player.tfaCode;
            let attempts: number;
            attempts = +body['attempts'];
            let path: string;

            if (codeToVerify == codeStored) // 2fa enabled
            {
                path = `${process.env.DOMAIN}/main_page?loginName=`;
                this.userService.enableTFA(player.loginName, true);  // enable TFA
                // reset codeStored to default
            }
            else if (attempts < 3)  // try again 
            {
                attempts++;
                // path = `${process.env.DOMAIN}/login_2fa`;
                this.tfaService.sendVerificationMail(player); 
                // store attempts? 
                // store new code 
                return {message: 'Incorrect Code. New Code has been sent. Try again!'};
            }
            else // restart auth 
            {
                path = `${process.env.BACKEND}/auth/login`;
                // reset attempt to 0 / or erase attempt from body 
            }
            return response.redirect(path);
        }catch(err){
            this.logger.log('Error updating the profile name: ', err);
            throw new HttpException('Two Factor Authentication verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}