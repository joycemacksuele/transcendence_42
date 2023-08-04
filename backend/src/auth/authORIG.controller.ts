import { Controller, Get, Logger, Request, Response, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	logger: Logger = new Logger('auth');

	constructor(
		private readonly authService: AuthService
//		private readonly userService: UserService
	) {
		console.log('test print');
	}

	//		STEP 1: LOGIN - redirect 
	//--------------------------------------------------
	//To redirect a response to a specific URL use a @Redirect() decorator or a library-specific response object (and call res.redirect() directly).
	// @Redirect() takes two arguments, url and statusCode, both are optional. The default value of statusCode is 302 (Found) if omitted.
	@Get()
	@Redirect(
		`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=https%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code`,
		302
	)

	// if approved it will be redirected to your "redirect_uri" (API settings) with a temporary code in a GET "code" 
	// as well as the state you provided in the previous step in a "state" parameter 



	//		STEP 2 - GET request with temporary "code"
	@Get('token') // 'token' - end point of address 
	async getAuthToken(@Request() request, @Response() response) {
		const requestUrl = request['url'];
		const returnCode = requestUrl.split('code=')[1];
		const data = {
			grant_type: 'authorization_code',
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.API_SECRET,
			code: returnCode,
			redirect_uri: 'https://localhost:3001/auth/token'
		};
		try {		// 	STEP 3 - POST request to exchange the code for an access token 
			return await this.authService.exchangeCodeForAccessToken(data, response);
		} catch (err) {
			this.logger.log(err);
		}
	}


	
//   @Get()
//   login(): string {
//     return this.authService.getAccessToken();
//   }


}
