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
    async verifyTwoFactorAuthentification(@Request() request: any, @Body() body: any, @Response() response: any){
        try{
            let player = await this.userService.getUserByLoginName(request.loginName);
            const codeStored = player.tfaCode;
            const codeToVerify = body;

            let attempts: number;
            attempts = +(request.get('Cookie')).split('cookieLogInAttempts=')[1];
            this.logger.log("attempts: " + attempts);

            let path: string;

            if (codeStored === 'default')
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR); // redirect to the auth page? 

            if (codeToVerify === codeStored) // succesful verification
            {
                path = `${process.env.DOMAIN}/main_page?loginName=`;
                // this.userService.enableTFA(player.loginName, true);  // this needs to be moved to the profile page
                this.userService.updateStoredTFACode(player.loginName, 'default');
            }
            else if (attempts < 3)  // failed verification within the 3 attempts
            {
                path = `${process.env.DOMAIN}/main_page?loginName=`;  // will change to path = `${process.env.DOMAIN}/login_2fa`;
                
                attempts++;
                let cookieLogInAttempts = `${attempts}; path=/;`;
                response.append('Set-Cookie', cookieLogInAttempts);

                this.tfaService.sendVerificationMail(player);  // this stores the new code 
                return {message: 'Incorrect Code. New Code has been sent. Try again!'};  // does it return the cookies???
            }
            else // restart auth 
            {
                path = `${process.env.BACKEND}/auth/login`;
                response.clearCookie('Cookie');
                this.userService.updateStoredTFACode(player.loginName, 'default');
            }
            return response.redirect(path);
        }catch(err){
            this.logger.log('verify_user error: ', err);
            throw new HttpException('Two Factor Authentication verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    // @Post('verify_code')
    // async verifyTwoFactorAuthentification(@Body() body: any, @Request() request: any, @Response() response: any){
    //     try{
    //         const codeToVerify = body['tfaCode'];
    //         let player = await this.userService.getUserByLoginName(request.loginName);
    //         const codeStored = player.tfaCode;
    //         let attempts: number;
    //         attempts = +body['attempts'];
    //         let path: string;

    //         if (codeToVerify == codeStored) // 2fa enabled
    //         {
    //             path = `${process.env.DOMAIN}/main_page?loginName=`;
    //             this.userService.enableTFA(player.loginName, true);  // enable TFA
    //             // reset codeStored to default
    //         }
    //         else if (attempts < 3)  // try again 
    //         {
    //             attempts++;
    //             // path = `${process.env.DOMAIN}/login_2fa`;
    //             this.tfaService.sendVerificationMail(player); 
    //             // store attempts? 
    //             // store new code 
    //             return {message: 'Incorrect Code. New Code has been sent. Try again!'};
    //         }
    //         else // restart auth 
    //         {
    //             path = `${process.env.BACKEND}/auth/login`;
    //             // reset attempt to 0 / or erase attempt from body 
    //         }
    //         return response.redirect(path);
    //     }catch(err){
    //         this.logger.log('Error updating the profile name: ', err);
    //         throw new HttpException('Two Factor Authentication verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}