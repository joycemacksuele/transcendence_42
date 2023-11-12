import { Controller, Get, Logger, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OpenAccess } from './guards/auth.openaccess';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';

//.env 
// Dotenv is a library used to inject environment variables from a file into your program 


@OpenAccess()  // this allows it to work without being logged in 
@Controller('auth')
export class AuthController {
	logger: Logger = new Logger('Auth Controllers');
	
	constructor(
		private readonly authService: AuthService,
		) {}		

	//		STEP 1: LOGIN - redirect 
	//--------------------------------------------------------------------------------
	//To redirect a response to a specific URL use a @Redirect() decorator or a library-specific response object (and call res.redirect() directly).
	// @Redirect() takes two arguments, url and statusCode, both are optional. The default value of statusCode is 302 (Found) if omitted.
	
	@Get('login')
	async getLoginPage(@Request() request:any, @Response() response: any){
		let id = process.env.CLIENT_ID;
		let path = `https://api.intra.42.fr/oauth/authorize?client_id=${id}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code`;

		try{
			this.logger.log('Redirecting to OAuth...');
			this.logger.log('Restarting Auth path = ' + path);
			return response.redirect(path);  // 302 http status 
		}
		catch(err){
			this.logger.log('getAuthLogin: ' + err);
		}
	}
	// // if approved it will be redirected to your "redirect_uri" (API settings) with a temporary code in a GET "code" 
	// // as well as the state you provided in the previous step in a "state" parameter


	//		STEP 2 - GET request with temporary "code"
	//--------------------------------------------------------------------------------
	@OpenAccess()  // this should not be needed!!!!!!!!!!!!!!!!!!!!!
	@Get('token') // 'token' - end point of address 
	async getAuthorizationToken(@Request() request: any, @Response() response: any) {

		const reqUrl = request['url'];
		const requestCode = reqUrl.split('code=')[1];
		// this.logger.log('OAuth code received: ' + requestCode);
		console.log('Jaka: The whole request URL: ', reqUrl);
		console.log('Jaka:           requestCode: ', requestCode);

		//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
		const parameters = new URLSearchParams();
		parameters.append('grant_type', 'authorization_code');
		parameters.append('client_id', process.env.CLIENT_ID);
		parameters.append('client_secret', process.env.SECRET);
		parameters.append('redirect_uri', process.env.REDIRECT);
		parameters.append('code', requestCode);

		try {
			this.logger.log('getAuthorizationToken: ' + response);
			console.log('Jaka, AUTH response HEADERS:\n', response.getHeaders());
			return await this.authService.exchangeCodeForAccessToken(parameters, response);
		} catch (err) {
			this.logger.log('getAuthToken: ' + err);
		}
	}

	@Get('logout')   // to be connected with frontend
	async logOut(@Request() req:any, @Response() res:any){
		// find the user, change status, 2fa
		try{
			this.authService.logout(req, res);
		}
		catch(err){
			this.logger.log('getAuthorizationLogout: ' + err);
		}
	}
}
