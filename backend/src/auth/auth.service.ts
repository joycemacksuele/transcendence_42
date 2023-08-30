import { Injectable, Logger, HttpException, HttpStatus} from '@nestjs/common';
import { Request, Response, response } from 'express';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as bcryptjs from 'bcryptjs'; // added jaka: Importing bcryptjs
import { CreateUserDto } from 'src/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { serialize } from 'cookie';


// jaka, added interface, to be sent back to the frontend via .json()
interface UserData {
	loginName: string;
	loginImage: string;
	loginTest: string;
	// ...
}



// Jaka, for testing
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService, private jwtService: JwtService) {}
	logger: Logger = new Logger('Auth Services');

  //    STEP 3 - make POST request to exchange the code for an access token 
  // This request needs to be performed on the server side, over a secure connection
	async exchangeCodeForAccessToken(clientData: any, res: Response) {
		let access_token: string;
		await axios
			.post('https://api.intra.42.fr/oauth/token', clientData)
			.then((response) => {
				access_token = response.data['access_token'];
				this.logger.log('Access Token received: ' + access_token); //
				
			})
			.catch((error) => {
				this.logger.error('\x1b[31mAn Error in 42 API: post request\x1b[0m' + error.response.data);
				throw new HttpException('Authorization failed with 42 API', HttpStatus.UNAUTHORIZED);
			});
		//await sleep(2000);	// jaka, remove
		await this.getTokenOwnerData(access_token, clientData.get('client_secret'), res);
	}

//    STEP 4 - Make API requests with token 
// GET request to the current token owner with the bearer token - get user info in response
async getTokenOwnerData(access_token: string, secret: string, res: Response) {
	const authorizationHeader: string = 'Bearer ' + access_token;
	let login: string;
	let id: string;
	let avatar: string;

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
		this.logger.log('Token owner data received: login:' + login + ' id: ' + response['data'].id);
		this.logger.log('Token owner data received: image: ' + avatar);

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
		// intraId: +id,	// todo, jaka, change back ?? Maybe it needs to be converted to a number?
		intraId: 0,
		hashedSecret: hash,
		profileImage: avatar
	};

	this.logger.log('dto:  intraLogin: ' + dto.loginName + ' intraId: ' + dto.intraId); // testing purpose - TO BE REMOVED!

	return await this.getOrCreateUser(dto, res);
	// return await this.getOrCreateUser(login, id, hash, image);




	// return await this.getOrCreateUser(login, id, avatar, hash);
	// find user in repository 
	// if user exists response.redirect(http://localhost:3000/profile)
	// if user doesn't exist 
//   return await this.generateUser(login, res, avatar);
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
			return await bcryptjs.hash(secret, saltOrRounds); // added jaka to try instead of bcrypt
			// return await bcrypt.hash(secret, saltOrRounds);
			//return ('temporary to test ....');	// todo, jaka, remove this
		}
		catch (err) {
			this.logger.error('\x1b[31mHash secret error: \x1b[0m' + err);
		}
	}

	async getOrCreateUser(data: any, response: Response) {
		let newPlayer: CreateUserDto;
    	let token: string; 

		this.logger.log('test create/find user ');
		// let player = await this.userService.getUserByLoginName(data.intraLogin);	// jaka, outcommentedm used loginName instead
		let player = await this.userService.getUserByLoginName(data.loginName);
		// this.logger.log('find player: ' + player.loginName);

		if (!player) {
			try {
				player = await this.userService.createUser(data);
				this.logger.log('made new player: ' + player.loginName);
				// this.logger.log('made new player: ' + newPlayer.loginName);
			}
			catch (err) {
				this.logger.error('Error creating new player: ' + err);
				return ;
			}
			// const test = await this.userService.getUserByLoginName(data.intraLogin);	// jaka, outcommentedm used loginName instead
			const test = await this.userService.getUserByLoginName(data.loginName);
			this.logger.log('test: Just created a new user:' + test.loginName);
		}
		
		this.logger.log('test: Current User: data.intraLogin:' + data.intraLogin);
		this.logger.log('test: Current User: data.loginName:' + data.loginName);
		this.logger.log('test: Current User: player.loginName:' + player.loginName);
		
	
		// token = !player ? await this.signToken(newPlayer.loginName, newPlayer.intraId) : await this.signToken(newPlayer.loginName, newPlayer.intraId);
		// token = !player ? await this.signToken(player) : await this.signToken(player);
		token = await this.signToken(player);
		if (!token) {
			throw new HttpException('Signing token failed.', HttpStatus.SERVICE_UNAVAILABLE);
		}

		this.logger.log('Set-Cookie token: ' + token);

		// Added jaka:
		// These attributs should be included when the the App is ready for 'production' 
		// const cookieAttributes = {
			// httpOnly: true,
			// secure: true,
			// maxAge: 60 * 60 * 1000;	// 60 minutes
		// };


		// response.setHeader('Set-Cookie', 'token='+token); // {} = options
		response.setHeader('Set-Cookie', `token=${token}`); // {} = options

		// Jaka, create a response structure, to be sent via .json()
		const userData: UserData = {
			loginName: player.loginName,
			loginImage: player.profileImage,
			loginTest: 'test string',
			// ...
		}

		console.log('Trying to print token: ' + response.getHeader("Set-Cookie"));
		// const util = require('util');
		// console.log('trying to print response: ', util.inspect(response, { depth: null }));
		console.log('Response status code ', response.statusCode);
		// console.log('trying to print response: ', response.data );
		// return response.redirect('http://localhost:3000/main_page?loginName=' + player.loginName + '&loginImage=' + player.profileImage);

		// return response.status(HttpStatus.OK);
		return response.status(HttpStatus.OK).json(userData);
		// return response

		// return response.status(302).json({
		// 	redirect: 'http://localhost:3000/main_page',
		// 	userData: {
		// 		loginName: player.loginName,
		// 		loginImage: player.profileImage,
		// 	}
		// })

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
				secret: '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'
			});
		}
		catch (err) {
			throw new HttpException('Signing JWT token failed.', HttpStatus.SERVICE_UNAVAILABLE);
		}
		return token;
	}

  logout(req: Request, response: Response) {
	try{
		this.logger.log('Jaka: logging out ...');
		response.clearCookie('token');
		return response.send({ message: 'Logout succeeded' });
	}
	catch{
		throw new HttpException('Failed to logout', HttpStatus.SERVICE_UNAVAILABLE); // check if other status is better suited 
	}
  }
}

