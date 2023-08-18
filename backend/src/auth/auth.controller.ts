import { Controller, Get, Logger, Request, Response, Redirect, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { request } from 'http';
import { response } from 'express';

//.env 
// Dotenv is a library used to inject environment variables from a file into your program 


@Controller('auth')
export class AuthController {
	logger: Logger = new Logger('Auth Controllers');

	constructor(
		private readonly authService: AuthService
		// private readonly userService: UserService
	) {}

	//		STEP 1: LOGIN - redirect 
	//--------------------------------------------------
	//To redirect a response to a specific URL use a @Redirect() decorator or a library-specific response object (and call res.redirect() directly).
	// @Redirect() takes two arguments, url and statusCode, both are optional. The default value of statusCode is 302 (Found) if omitted.
	@Get('login')
	@Redirect(
		'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d56d700e9560937acc2eb4461b7fc08f12e39e060503cc22ea59b952aa77d806&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code',
		// `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID}&redirect_uri=https%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code`,
		302
	)
	redirect() {
		this.logger.log('Redirecting to OAuth...');
	}
	// if approved it will be redirected to your "redirect_uri" (API settings) with a temporary code in a GET "code" 
	// as well as the state you provided in the previous step in a "state" parameter 


	//		STEP 2 - GET request with temporary "code"
	@Get('token') // 'token' - end point of address 
	async getAuthorizationToken(@Request() request: any, @Response() response: any) {
		const reqUrl = request['url'];
		const requestCode = reqUrl.split('code=')[1];
		this.logger.log('OAuth code received: ' + requestCode);

		//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
		const parameters = new URLSearchParams();
		parameters.append('grant_type', 'authorization_code');
		parameters.append('client_id', 'u-s4t2ud-d56d700e9560937acc2eb4461b7fc08f12e39e060503cc22ea59b952aa77d806');
		parameters.append('client_secret', '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');
		parameters.append('code', requestCode);
		parameters.append('redirect_uri', 'http://localhost:3001/auth/token');
		try {
			return await this.authService.exchangeCodeForAccessToken(parameters, response);
		} catch (err) {
			this.logger.log('getAuthToken: ' + err);
			this.logger.log('getAuthToken response: ' + response.get('location'));

		}
	}
}
