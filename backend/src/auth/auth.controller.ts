import { Controller, Get, Post, Logger, Request, Body, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OpenAccess } from './guards/auth.openaccess';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { request } from 'https';

//.env 
// Dotenv is a library used to inject environment variables from a file into your program 

@OpenAccess()  // this allows it to work without being logged in 
@Controller('auth')
export class AuthController {
	logger: Logger = new Logger('Auth Controllers');
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
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
	@OpenAccess()
	@Get('token')
	async getAuthorizationToken(@Request() request: any, @Response() response: any) {
		const reqUrl = request['url'];
		const requestCode = reqUrl.split('code=')[1];

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
			this.logger.log('\x1b[31mgetAuthToken: \x1b[0m' + err);
		}
	}

	@Get('logout')
	async logOut(@Request() req:any, @Response() res:any){
		try{
			this.logger.log("Start logout");
			let payload = await this.authService.extractUserdataFromToken(req);
			let user = await this.userService.getUserByLoginName(payload.username);
			await this.userService.setOnlineStatus(user.loginName, false);
			await this.authService.removeAuthToken(req, res);
			await this.userService.updateRefreshToken(user.loginName, 'default'); 
		}
		catch(err){
			this.logger.log('\x1b[31mUnable to logout: \x1b[0m' + err);
		}
	}

	@Post('cleanToken')
	async cleanToken(@Request() req:any, @Response() res:any){
		try{
			this.logger.log("Start cleanToken function");
			return await this.authService.removeAuthToken(req, res);
		}
		catch(err){
			this.logger.log('\x1b[31mUnable to cleanToken: \x1b[0m' + err);
		}
	}

	@Post('updateAuth')
	async updateToken(@Request() request : any, @Body() data:{newToken: string}, @Response() response :any){
		try{
			this.logger.log("Start updateAuth controller");
			let payload = await this.authService.extractUserdataFromToken(request);
			let player = await this.userService.getUserByLoginName(payload.username); // retrieve user
			let newToken = await this.authService.signToken(player);

			response.setHeader('Set-Cookie', newToken);
			this.logger.log('New token set in the response header');

			let newRefreshToken = await this.authService.signToken(player);
			this.userService.updateRefreshToken(player.loginName, newRefreshToken);
			this.logger.log('New refresh token set in the database');
		}catch(err){
			this.logger.log('\x1b[31mUnable to updateToken: \x1b[0m' + err);
		}
	}
}
