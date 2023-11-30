import { Controller, Get, Post, Logger, Request, Req, Res, Body, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OpenAccess } from './guards/auth.openaccess';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { response } from 'express';
// import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { request } from 'https';
import { JwtService } from '@nestjs/jwt';

//.env 
// Dotenv is a library used to inject environment variables from a file into your program 

@OpenAccess()  // this allows it to work without being logged in 
@Controller('auth')
export class AuthController {
	logger: Logger = new Logger('Auth Controllers');
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly jwtService: JwtService
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
			// await this.authService.removeAuthToken(req, res);
			res.clearCookie('Cookie');
			await this.userService.updateRefreshToken(user.loginName, 'default'); 
			this.logger.log("Removed tokens. Logging out!");
		}
		catch(err){
			this.logger.log('\x1b[31mUnable to logout: \x1b[0m' + err);
		}
	}

	// @Post('cleanToken')
	// async cleanToken(@Request() req:any, @Response() res:any){
	// 	try{
	// 		this.logger.log("Start cleanToken function");
	// 		return await this.authService.removeAuthToken(req, res);
	// 	}
	// 	catch(err){
	// 		this.logger.log('\x1b[31mUnable to cleanToken: \x1b[0m' + err);
	// 	}
	// }

	// @Post('updateAuth')
	// async updateToken(@Req() request : any, @Body() data: {name: any}, @Res() response: any){
	// 	try{
	// 		this.logger.log("Start updateAuth controller ---------");
	// 		this.logger.log("data.name: " + data.name);
	// 		let player = await this.userService.getUserByLoginName(data.name); // retrieve user entity
	// 		console.log("player email: " + player.email);
	// 		let newToken = await this.authService.signToken(player);
	// 		console.log("UpdateAuth function - new token: " + newToken);

	// 		let cookies = request.get('Cookie'); // not needed
	// 		console.log("     verify cookie: " + cookies); // not needed
	// 		// const cookieAttributes = {
	// 		// httpOnly: true,
	// 		// path: '/',
	// 		// sameSite: 'none',
	// 		// };
	// 		// let cookieToken = `token=${newToken};`;
	// 		// for (let attribute in cookieAttributes) {
	// 		// if (cookieAttributes[attribute] === true) {
	// 		// 	cookieToken += ` ${attribute};`;
	// 		// } else
	// 		// 	cookieToken += ` ${attribute}=${cookieAttributes[attribute]};`;
	// 		// }
	// 		// response.setHeader('Set-Cookie', cookieToken);

	// 		// this.logger.log('New token set in the response header');

	// 		let newRefreshToken = await this.authService.signRefreshToken(player);
	// 		console.log("UpdateAuth function - new refreshToken: " + newRefreshToken);
	// 		await this.userService.updateRefreshToken(player.loginName, newRefreshToken);
	// 		this.logger.log('New refresh token set in the database');
	// 		// console.log(request);
	// 		return true; //await this.authService.replaceToken(request, response, newToken);
	// 	}catch(err){
	// 		this.logger.log('\x1b[31mUnable to updateToken: \x1b[0m' + err);
	// 	}
	// 	return false;
	// }

	// @Post('getPlayer')
	// async getPlayer(@Req() request : any, @Body() data: {name: any}){
	// 	try{
	// 		this.logger.log("player to be requested in the getPlayer Controller: " + data.name);
	// 		return await this.userService.getUserByLoginName(data.name);
	// 	}catch(err){
	// 		this.logger.log("Unable to get the player from the post request " + err);
	// 	}
	// }
}
