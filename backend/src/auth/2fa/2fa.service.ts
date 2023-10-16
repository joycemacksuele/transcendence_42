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

	sendVerificationMail(player: UserEntity)
	{
		let code :string;
        code = String(this.createCode());
		this.userService.updateStoredTFACode(player.loginName, code);


		// JAKA: TEMP. DISABLED, IT WAS GIVING ERROR AT LOGIN
		this.mailerService.sendMail({
			to: player.email,
			from: `'No reply ' ${process.env.EMAIL}`,
			subject: 'Unfriendly Ping Pong log in verification',
		// 	text: 'Your verification code is: ' + code,
		// 	html: '<b> really not sure what this does </b>',
		html: '<p>Hey ' + player.loginName + ' ,</p> <p>Your verification code is: ' + code + '</p><p>If you did not request this email you can safely ignore it.</p>',
		});
	}
}