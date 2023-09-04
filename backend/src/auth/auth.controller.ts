import { Controller, Get, Logger, Request, Response, Redirect, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { request } from 'http';
import { response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { OpenAccess } from './guards/auth.openaccess';

//.env 
// Dotenv is a library used to inject environment variables from a file into your program 




@OpenAccess()  // this allows it to work without being logged in // jaka, to remove ??
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
	@OpenAccess()
	@Get('token') // 'token' - end point of address 
	async getAuthorizationToken(@Request() request: any, @Response() response: any) {

		const reqUrl = request['url'];
		const requestCode = reqUrl.split('code=')[1];
		// this.logger.log('OAuth code received: ' + requestCode);
		console.log('Jaka: The whole request URL: ', reqUrl);
		console.log('Jaka:           requestCode: ', requestCode);
		// console.log('Jaka: The whole request: ', request);


		//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
		const parameters = new URLSearchParams();
		parameters.append('grant_type', 'authorization_code');
		parameters.append('client_id', 'u-s4t2ud-d56d700e9560937acc2eb4461b7fc08f12e39e060503cc22ea59b952aa77d806');
		parameters.append('client_secret', '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');
		parameters.append('code', requestCode);
		parameters.append('redirect_uri', 'http://localhost:3001/auth/token');
		// parameters.append('redirect_uri', 'http://localhost:3000/auth-callback');
		try {
			// console.log('Jaka, whole AUTH response:\n', response);
			console.log('Jaka, AUTH response HEADERS:\n', response.getHeaders());

			// IT DOES COME TO HERE , BUT IN BROWSER THE JSON DATA IS SEEN ???


			return await this.authService.exchangeCodeForAccessToken(parameters, response);
		} catch (err) {
			this.logger.log('getAuthToken: ' + err);
			this.logger.log('getAuthToken response: ' + response.get('location'));

		}
	}

	@Get('logout')   // to be connected with frontend
	async logOut(@Request() req:any, @Response() res:any){
		// find the user, change status, 2fa
		try {
			this.authService.logout(req, res);
		}
		catch(err){
			this.logger.log(err);
		}
	}
}
