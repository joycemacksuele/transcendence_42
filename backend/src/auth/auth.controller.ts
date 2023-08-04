import { Controller, Get, Logger, Request, Response, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	logger: Logger = new Logger('auth');

	constructor(
		private readonly authService: AuthService
//		private readonly userService: UserService
	) 	{
			console.log('print from auth.controller');
		}

	//		STEP 1: LOGIN - redirect 
	//--------------------------------------------------
	//To redirect a response to a specific URL use a @Redirect() decorator or a library-specific response object (and call res.redirect() directly).
	// @Redirect() takes two arguments, url and statusCode, both are optional. The default value of statusCode is 302 (Found) if omitted.

	// getExample(): string {
	// 	console.log('test from auth.controller (print in local terminal)');
	// 	return '[BACKEND] This is the response from "AUTH" endpoint.';
	// }

	@Get('login')
	@Redirect(
		`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-cbdaf4baea7a8de06d665cfd19ad5ba56e1e4079d72114b284a2adf05f4f63b5&redirect_uri=http://localhost:3000/main_page&response_type=code&scope=public&state=alkdfjhglskduhgalkhsjdlkahldsakjhsdlkjghalskdjhgalsjdg`,
		302
	)

	// if approved it will be redirected to your "redirect_uri" (API settings) with a temporary code in a GET "code" 
	// as well as the state you provided in the previous step in a "state" parameter 

	//		STEP 2 - GET request with temporary "code"
	// @Get('token') // 'token' - end point of address 
	// async getAuthToken(@Request() request, @Response() response) {
	// 	const requestUrl = request['url'];
	// 	const returnCode = requestUrl.split('code=')[1];
	// 	const data = {
	// 		grant_type: 'authorization_code',
	// 		client_id: process.env.CLIENT_ID,
	// 		client_secret: process.env.API_SECRET,
	// 		code: returnCode,
	// 		redirect_uri: 'https://localhost:3001/auth/token'
	// 	};
	// 	try {		// 	STEP 3 - POST request to exchange the code for an access token 
	// 		return await this.authService.exchangeCodeForAccessToken(data, response);
	// 	} catch (err) {
	// 		this.logger.log(err);
	// 	}
	// }

  @Get()
  login(): string {
    // return this.authService.getAccessToken();
	return ('something');
  }
}



// OUR KEYS //////////////////////////////////////////////////////////////
/*
uid:
***REMOVED***

secret:     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

https://api.intra.42.fr/oauth/authorize?client_id=***REMOVED***&redirect_uri=https%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code
*/