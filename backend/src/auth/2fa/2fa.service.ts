import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Logger } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly userService: UserService) {}
	logger: Logger = new Logger('2FA mail services');

	createCode(){
		let code = Math.floor(100000 + Math.random() * 900000);
		return code;
	}

	async sendVerificationMail(player: UserEntity): Promise <void>	{
		let code :string;
        code = String(this.createCode());
		this.logger.log('create verification code: ' + code);

		let updateCode = await this.userService.updateStoredTFACode(player.loginName, code);
		this.logger.log('stored tfa: ' + player.tfaCode + " (here still shows old code, but not updated)");
		this.logger.log("            Should the user data be fetched again to show the updated code?");
		this.logger.log('stored player.email: ' + player.email);
		
		this.mailerService.sendMail({
			to: `${player.email}`,
			from: `No reply ${process.env.EMAIL}`,
			subject: 'Unfriendly Ping Pong log in verification',
			text: 'Hey ' + player.loginName + ' ,Your verification code is: ' + code + 'If you did not request this email that sounds like a you problem!',
			html: '<p>Hey ' + player.loginName + ' ,</p> <p>Your verification code is: ' + code + '</p><p>If you did not request this email that sounds like a you problem!</p>',
		});
		
		this.logger.log('verification email sent');
	}

	async inputCheck(value? : string): Promise<boolean>
	{
		if (value === null)
		{
			this.logger.log("value null");
			return false;
		} 
		if (value.length !== 6)
		{
			this.logger.log("length: " + value.length);
			return false;
		} 
		if (typeof(+value) !== "number")
		{
			this.logger.log("not a number: ");
			return false;
		}
		return true;
	}
}