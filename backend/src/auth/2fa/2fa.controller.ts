import { Body, Controller, Get, Post, Request, Response, HttpException, HttpStatus } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { TwoFactorAuthService } from "./2fa.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import axios from 'axios';


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

    // @Get('test')
    // async test(@Request() request: any, @Response() response: any){
    //     try{
    //         let path = `${process.env.DOMAIN}/main_page?loginName=`;
    //         return response.redirect(path);
    //     }
    //     catch(err){
    //         this.logger.log('error 2fa test: ' + err);
    //     }
    // }

    @Post('verify_code')
    async verifyTwoFactorAuthentification(@Request() request: any, @Body() data: {inputValue: string}){
        try{
            let player = await this.userService.getUserByLoginName(request.loginName);
            const codeStored = player.tfaCode;
            const codeToVerify = data.inputValue;
    
            this.logger.log('codeStored: ' + codeStored);
            this.logger.log('codeToVerify:  ' + codeToVerify);
    
            if (codeStored === 'default')
            {
                this.logger.log('codeStored === default');
                throw new HttpException('Internal Server Error: Verification email was not sent', HttpStatus.INTERNAL_SERVER_ERROR); // redirect to the auth page? 
            }
            if (codeToVerify === codeStored)
                return true;
            else 
                return false;
        }catch(err){
            this.logger.log('verify tfa code: ', err);
            throw new HttpException('Two Factor Authentication verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // @Post('verify_code')
    // // async changeProfileName(@Body() data: { profileName: string, loginName: string }): Promise<{ message: string }> {
    // async verifyTwoFactorAuthentification(@Request() request: any, @Body() data: {inputValue: string}, @Response() response: any){
    //     try{
    //         let player = await this.userService.getUserByLoginName(request.loginName);
    //         const codeStored = player.tfaCode;
    //         const codeToVerify = data.inputValue;

    //         let attempts: number;
    //         attempts = (request.get('Cookie')).split('cookieLogInAttempts=')[1];
    //         this.logger.log("attempts: " + attempts);
    //         attempts = + attempts;
    //         let path: string;

    //         this.logger.log('codeStored: ' + codeStored);
    //         this.logger.log('codeToVerify:  ' + codeToVerify);

    //         if (codeStored === 'default')
    //         {
    //             this.logger.log('codeStored === default');
    //             throw new HttpException('Internal Server Error: Verification email was not sent', HttpStatus.INTERNAL_SERVER_ERROR); // redirect to the auth page? 
    //         }

    //         if (codeToVerify === codeStored) // succesful verification
    //         {
    //             this.logger.log('codeStored === codeStored');
    //             let update = await this.userService.updateStoredTFACode(player.loginName, 'default');
                
    //             // path = `${process.env.DOMAIN}/main_page?loginName=`;
    //             response.clearCookie('cookieLogInAttempts');
    // 			// response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // 			// response.setHeader('Access-Control-Allow-Credentials', 'omit');
    // 			// response.setHeader('Access-Control-Request-Headers', 'Access-Control-Allow-Origin');


    //             this.logger.log('Access-Allow:' + response.getHeader('Access-Control-Allow-Origin'));
    // 			// response.setHeader('Sec-Fetch-Site', 'cros-site');

    //             // console.log(response);

    //             const goodVerification = await axios
    //             .get(`${process.env.DOMAIN}main_page?loginName=`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },                    
    //             })
    //             .catch((err) => {
    //             this.logger.log('err: ' + err);
    //             this.logger.error('\x1b[31mFailed to show profile page in procedure from 2fa\x1b[0m');
    //             throw new HttpException('Failed to show profile page', HttpStatus.UNAUTHORIZED);
    //             });

    //         }
    //         // else if (attempts < 3)  // failed verification within the 3 attempts
    //         // {
    //         //     this.logger.log('attempts < 3');
    //         //     path = `${process.env.DOMAIN}/Login_2fa`;
    //         //     // path = `${process.env.DOMAIN}/main_page?loginName=`;  // will change to path = `${process.env.DOMAIN}/login_2fa`;
                
    //         //     attempts++;
    //         //     let cookieLogInAttempts = `${attempts}; path=/;`;
    //         //     response.append('Set-Cookie', cookieLogInAttempts);
                
    //         //     this.userService.updateStoredTFACode(player.loginName, 'default');

    //         //     // this.tfaService.sendVerificationMail(player);  // this stores the new code 
    //         //     // return {message: 'Incorrect Code. New Code has been sent. Try again!'};  // does it return the cookies???
    //         // }
    //         else // restart auth 
    //         {
    //             this.logger.log('verify code restart authentification process');

    //             // path = `${process.env.BACKEND}/auth/login`;
    //             console.log('request cookie before being erased: ' + request.get('Cookie'));
    //             console.log('response cookie before being erased: ' + response.get('Cookie'));

    //             response.clearCookie('Cookie');
    //             let cookie = request.get('Cookie');
    //             if (!cookie)
    //                 console.log('undefined cookies');
    //             else 
    //                 console.log('erased cookies: ' + cookie);
    //             let updateCode = await this.userService.updateStoredTFACode(player.loginName, 'default');

    //             // return await axios
	// 		    // .get(`${process.env.BACKEND}/auth/login`);
    //             // response.header("Access-Control-Allow-Origin", "true");
    //             let id = process.env.CLIENT_ID;
    //             path = `https://api.intra.42.fr/oauth/authorize?client_id=${id}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code`;
        


    //             // const restartLogin = await axios
    //             // .get(`${process.env.BACKEND}/auth/login`, {
    //             //     headers: {
    //             //     }
    //             // })
    //             // .catch(() => {
    //             // this.logger.error('\x1b[31mAn Error in restarting log in procedure from 2fa\x1b[0m');
    //             // throw new HttpException('TwoFA Authorization failed', HttpStatus.UNAUTHORIZED);
    //             // });
    //         };
    //         this.logger.log('path before return: ' + path);
    //         response.status(200);
    //         return response.redirect(path);
    //     }catch(err){
    //         this.logger.log('verify_user error: ', err);
    //         throw new HttpException('Two Factor Authentication verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }




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