import { Body, Controller, Get, Post, Req, Res, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import { Logger } from "@nestjs/common";
import { TwoFactorAuthService } from "./2fa.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth.service";

@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly tfaService: TwoFactorAuthService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService   // added jaka, to enable extractUserdataFromToken()
        ) {}
    logger: Logger = new Logger('2FA mail controller');

    @Post('verify_code')
    async verifyTwoFactorAuthentification(@Req() request: any, @Body() data: {inputValue: string}){
        try{
            // extractUserFromHeader
            let payload = await this.authService.extractUserdataFromToken(request);
            this.logger.log("      ... payload.username: ", payload.username);

            this.logger.log('Start verify_code function: ');
            this.logger.log('code to verify: ' + data.inputValue);

            let sqlCheck = await this.tfaService.inputCheck(data.inputValue);  // sql input verification 
            if (sqlCheck === false)
            {
                this.logger.log('SQL Verification failed. Return false!');
                return false;
            }
            
            let user = await this.userService.getUserByLoginName(payload.username); // retrieve user
            const codeStored = user.tfaCode;
            const codeToVerify = data.inputValue;    
            this.logger.log('User data retrieved: email: ' + user.email);
            this.logger.log('User data retrieved: tfaCode: ' +  user.tfaCode);
            this.logger.log('Database codeStored: ' + codeStored);
            this.logger.log('User input code to verify: ' + codeToVerify);
    
            if (codeStored === 'default')
            {
                this.logger.log('codeStored === default');
                throw new HttpException('Internal Server Error: Verification email was not sent', HttpStatus.INTERNAL_SERVER_ERROR); 
            }
            if (codeToVerify === codeStored)
            {
    			await this.userService.setOnlineStatus(user.loginName, true);
                await this.userService.updateStoredTFACode(user.loginName, "default");
                this.logger.log('2fa verification successfull! Codes match!');
                return true;
            }
            else {
                this.logger.log('2fa verification failed! Codes did not match!');
                let temp = await this.userService.updateStoredTFACode(user.loginName, "default");
                return false; 
            }
        } catch(err) {
            this.logger.log('Error in verify 2fa code: ', err);
            throw new HttpException('Two Factor Authentication verification attempt one failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('resend_email_code')
    async resendVerificationMail(@Req() req, @Res() res: Response) {
        try {
            this.logger.log('Start resend_email_code');
            let payload = await this.authService.extractUserdataFromToken(req);
            this.logger.log('Extracted user from header: ', payload.username); // returns the token payload, NOT THE USER ENTITY
            
            let user = await this.userService.getUserByLoginName(payload.username); // retrieve user
            this.logger.log('User data retrieved: email: ' + user.email);

            await this.tfaService.sendVerificationMail(user);
            res.status(HttpStatus.OK).send({ message: 'Verification email has been re-sent.' });
        } catch (error) {
            this.logger.log('Error re-sending the code email: ', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'To Factor Authentication verification attempt two/three failed' });
        }
    }


    @Get('get-status')
    async get2faStatus(@Req() req, @Res() res: Response) {
        try {
            let payload = await this.authService.extractUserdataFromToken(req);
            let user    = await this.userService.getUserByLoginName(payload.username);
            // this.logger.log('tfastatus: ', user.tfaEnabled);
            res.json({ tfaStatus: user.tfaEnabled });
        } catch (error) {
            console.error('Error fetching tfa status.');
        }
    }


    @Post('toggle_button_tfa')
    async toggleButtonTfa(@Req() req, @Res() res: Response) {
        try {
            // this.logger.log('Start toggle_button_tfa');
            let payload = await this.authService.extractUserdataFromToken(req);
            // this.logger.log("request.user: ", payload.username); // returns payload, not user entity
            
            let user = await this.userService.getUserByLoginName(payload.username);  // retrieve user entity
            if (!user) {
                throw new Error('toggle_button_tfa: User not found');
            }
            // this.logger.log("verify user: user.email- ", user.email);

            // Toggle TFA status
            const updatedTfaStatus = !user.tfaEnabled;

            await this.userService.enableTFA (user.loginName, updatedTfaStatus); // update database

            res.status(HttpStatus.OK).send({ message: 'Button toggled tfa OK.' , tfaEnabled: updatedTfaStatus });
        } catch (error) {
            this.logger.log('Error toggled tfa button: ', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Unable to update toggle tfa button' });
        }
    }

    // @Post('send_tfa_code')
    // async sendCode(@Req() req, @Res() res: Response) {
    //     try {
    //         this.logger.log('Start send_tfa_code');

    //         let payload = await this.authService.extractUserFromRequest(req); // extract user from header
    //         this.logger.log('Extracted user from header: ', payload.username); // returns the token payload, NOT THE USER ENTITY
            
    //         let user = await this.userService.getUserByLoginName(payload.username); // retrieve user
    //         this.logger.log('User data retrieved: email: ' + user.email);

    //         await this.tfaService.sendVerificationMail(user);
    //         res.status(HttpStatus.OK).send({ message: 'Verification email has been sent.' });
    //     } catch (error) {
    //         this.logger.log('Error rsending the code email: ', error);
    //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'To Factor Authentication semail sending failed' });
    //     }
    // }
}
