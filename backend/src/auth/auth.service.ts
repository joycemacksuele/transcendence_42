import { Injectable, Logger, HttpException, HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from 'src/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { TwoFactorAuthService } from './2fa/2fa.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService, 
		private readonly tfaService: TwoFactorAuthService
		) {}
	logger: Logger = new Logger('Auth Services');

	//    STEP 3 - make POST request to exchange the code for an access token 
	//--------------------------------------------------------------------------------
	// This request needs to be performed on the server side, over a secure connection

	async exchangeCodeForAccessToken(clientData: any, res: Response) {
		// console.log('Start Exchange Code for token');
		let access_token: string;
		await axios
			.post('https://api.intra.42.fr/oauth/token', clientData)
			.then((response) => {
				access_token = response.data['access_token'];
				this.logger.log('Access Token received: ' + access_token); //
				
			})
			.catch((error) => {
				// this.logger.error('\x1b[31mAn Error in 42 API: post request: response: \x1b[0m' + JSON.stringify(response));
				// this.logger.error('\x1b[31mAn Error in 42 API: post request: error.response: \x1b[0m' + JSON.stringify(error.response));
				this.logger.error('\x1b[31mAn Error in 42 API: post request: error.response.data: \x1b[0m' + JSON.stringify(error.response.data));
				throw new HttpException('Authorization failed with 42 API', HttpStatus.UNAUTHORIZED);
			});
		await this.getTokenOwnerData(access_token, clientData.get('client_secret'), res);
	}

	//    STEP 4 - Make API requests with token 
	//--------------------------------------------------------------------------------
	// GET request to the current token owner with the bearer token - get user info in response

	async getTokenOwnerData(access_token: string, secret: string, res: Response) {
		const authorizationHeader: string = 'Bearer ' + access_token;
		let login: string;
		let id: string;
		let avatar: string;
		let email: string;

		const userInfo = await axios
		.get('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: authorizationHeader
			} // fetch the current token owner 
		})
		.then((response) => {
			login = response['data'].login;
			id = response['data'].id;
			avatar = response['data'].image.link;
			email = response['data'].email;
			this.logger.log('Token owner data received: login:' + login + ' id: ' + response['data'].id);
			this.logger.log('Token owner data received: image: ' + avatar);
			this.logger.log('E-mail: ' + email);

		})  // save the token owner info 
		.catch(() => {
		this.logger.error('\x1b[31mAn Error in 42 API: get token owner data\x1b[0m');
		throw new HttpException('Authorization failed with 42 API', HttpStatus.UNAUTHORIZED);
		});

	const hash = await this.hashSecret(secret);
	this.logger.log('Hash: ' + hash);  // testing purposes - TO BE REMOVED!  

	const dto: CreateUserDto = {
		loginName: login,
		profileName: login,  // profileName
		intraId: +id,	// todo, jaka, change back ?? Maybe it needs to be converted to a number?
		// intraId: 0,
		email: email,
		hashedSecret: hash,
		tfaEnabled: false,
		tfaCode: 'default',
		profileImage: avatar,
		roomsCreated: [1, 2]
	};

	this.logger.log('dto:  intraLogin: ' + dto.loginName + ' intraId: ' + dto.intraId); // testing purpose - TO BE REMOVED!

	return await this.getOrCreateUser(dto, res);
	// if user exists response.redirect(http://localhost:3000/profile)
}

  // generate hash 
  //Hashing alone is not sufficient to mitigate more involved attacks such as rainbow tables. 
  //A better way to store passwords is to add a salt to the hashing process: adding additional random data 
  //to the input of a hashing function that makes each password hash unique. 
  //The ideal authentication platform would integrate these two processes, hashing and salting, seamlessly.
  //At Auth0, the integrity and security of our data are one of our highest priorities. 
  //We use the industry-grade and battle-tested bcrypt algorithm to securely hash and salt passwords. 

	async hashSecret(secret: string) {
		const saltOrRounds = 7; // can be changed 
		this.logger.log('Salt : ' + saltOrRounds + ' Secret: ' +  secret); // testing purpose - TO BE REMOVED!
		try {
			return await bcryptjs.hash(secret, saltOrRounds);
		}
		catch (err) {
			this.logger.error('\x1b[31mHash secret error: \x1b[0m' + err);
		}
	}

	async getOrCreateUser(data: any, response: Response) {
    	let token: string; 

		this.logger.log('test create/find user ');
		let player = await this.userService.getUserByLoginName(data.loginName);

		if (!player) {
			try {
				player = await this.userService.createUser(data);
				this.logger.log('made new player: ' + player.loginName);

				// ADDED JAKA: 							//	SAVE ORIG USER IMAGE TO THE ./uploads/ FOLDER
				const imageUrl = data.profileImage;		// 	AND STORE THE PATH TO THE DATABASE
				console.log("Jaka: ImageURL: ", imageUrl);

            	const imagePath = `./uploads/${player.loginName}.jpg`;
				try {
					await this.userService.downloadAndSaveImage(imageUrl, imagePath);
					await this.userService.updateProfileImage(player.loginName,	"uploads/" + player.loginName + ".jpg");
					console.log("User image saved.");
				} catch(err) {
					this.logger.error('Error updating profile image for player: ' + err);					
				}
			}
			catch (err) {
				this.logger.error('Error creating new player: ' + err);
				return ;
			}
			const test = await this.userService.getUserByLoginName(data.loginName);
			this.logger.log('test: Created a new user:' + test.loginName);
		}
		
		this.logger.log('getOrCreateUser: Current User:');
		this.logger.log('                          player.intraLogin:' + player.loginName);
		this.logger.log('                          player.profileName:' + player.profileName);
		this.logger.log('                          player.profileName:' + player.profileImage);
		this.logger.log('                          player.intrId:' + player.intraId);
		this.logger.log('                          player.email:' + player.email);
		this.logger.log('                          player.2fa:' + player.tfaEnabled);

		token = await this.signToken(player);
		if (!token) {
			throw new HttpException('Signing token failed.', HttpStatus.SERVICE_UNAVAILABLE);
		}


		this.logger.log('Set-Cookie token: ' + token);

		// Added jaka: ////////////////////////////////////////////////////////////////
		// These attributs should be included when the the App is ready for 'production' 
		const cookieAttributes = {
			httpOnly: true,
			path: '/',
			// sameSite: 'none',
			// secure: true,
			// maxAge: 60 * 60 * 1000;	// 60 minutes
		};

		// Variant B)
		// added jaka: appending the Attributes to the cookie
		let cookieToken = `token=${token};`;
		for (let attribute in cookieAttributes) {
			if (cookieAttributes[attribute] === true) {
				cookieToken += ` ${attribute};`;
			} else
				cookieToken += ` ${attribute}=${cookieAttributes[attribute]};`;
		}
		response.append('Set-Cookie', cookieToken);

		// Jaka: Just for test: Separate cookies with user data, without httpOnly
		let cookieUsername = `cookieUserName=${player.loginName}; path=/;`;
		response.append('Set-Cookie', cookieUsername);
		let cookieProfileName = `cookieProfileName=${player.profileName}; path=/;`;
		response.append('Set-Cookie', cookieProfileName);
		let cookieProfileImage = `cookieProfileImage=${player.profileImage}; path=/;`;
		response.append('Set-Cookie', cookieProfileImage);


		// response.cookie('jwt', token, {httpOnly: true, domain: process.env.DOMAIN, path: '/', secure: true});
		// Temp. disabled by Jaka
		// const jwt = 'token=' + token + ' ; HttpOnly; Secure; SameSite=Strict';
		// response.setHeader('Set-Cookie', jwt);

		// response.cookie('token', token, {httpOnly: true, domain: process.env.DOMAIN, path: '/', secure: true});
		console.log('print token inside request: ' + response.getHeader("set-cookie"));  // test 

		// if 2fa true display profile else redirect to 2fa 
		let path: string;
		if (player.tfaEnabled === true)
			path = `${process.env.DOMAIN}/main_page?loginName=`;
		else
		{
			path = `${process.env.DOMAIN}/main_page?loginName=`; //once implemented this changes to: 
			// path = `${process.env.DOMAIN}/login_2fa`;
			this.tfaService.sendVerificationMail(player);
		}	

		response.status(200);
		return response.redirect(path); 														   // jaka, temp. added
		// return response.redirect('http://localhost:3000/main_page?loginName=jmurovec');
		// return response.redirect('http://localhost:3001/2faAuth' + const parameters? )
	}

	// JWT Token
	// In its compact form, JSON Web Tokens consist of three parts separated by dots (.), which are: Header, Payload, Signature

	// The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.

	// The second part of the token is the payload, which contains the claims. 
	// Claims are statements about an entity (typically, the user) and additional data. 
	// There are three types of claims: registered, public, and private claims.

	// To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.
	// The signature is used to verify the message wasn't changed along the way, and, 
	// in the case of tokens signed with a private key, it can also verify that the sender of the JWT is who it says it is.

  async signToken(player: CreateUserDto) {
		let token: string;

		const payload = { sub: player.intraId, username:player.loginName };  // https://docs.nestjs.com/security/authentication

		try {
			token = await this.jwtService.signAsync(payload, {
				secret: process.env.SECRET
			});
		}
		catch (err) {
			throw new HttpException('Signing JWT token failed.', HttpStatus.SERVICE_UNAVAILABLE);
		}
		return token;
	}

  logout(req: Request, response: Response) {
	try{
		response.clearCookie('token');
		// disable 2fa ? 
		return response.send({ message: 'Sign out succeeded' });
	}
	catch{
		throw new HttpException('Failed to logout', HttpStatus.SERVICE_UNAVAILABLE); // check if other status is better suited 
	}
  }
}

