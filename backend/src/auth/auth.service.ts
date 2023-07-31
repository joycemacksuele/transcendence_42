import { Injectable, Logger, HttpException, HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';  // JWT token

@Injectable()
export class AuthService {
//   oAuth(): string {
//     return 'https://api.intra.42.fr/oauth/authorize';
//   }

  logger: Logger = new Logger('Auth Service');

  //    STEP 3 - make POST request to exchange the code for an access token 
  // This request needs to be performed on the server side, over a secure connection
	async exchangeCodeForAccessToken(clientData: any, res: Response) {
		let access_token: string;
		await axios
			.post('https://api.intra.42.fr/oauth/token', clientData)
			.then((response) => {
				access_token = response.data['access_token'];
			})
			.catch(() => {
				this.logger.error('An Error in 42 API');
				throw new HttpException('Authorization failed with 42 API', HttpStatus.UNAUTHORIZED);
			});
		await this.makeApiRequest(access_token, clientData.client_secret, res);
	}

//    STEP 4 - Make API requests with token 
// GET request to the current token owner with the bearer token - get user info in response
async makeApiRequest(access_token: string, secret: string, res: Response) {
  const authorizationHeader: string = 'Bearer ' + access_token;
  let login: string;
  let userId: string;
  let avatar: string;

  const userInfo = await axios
    .get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: authorizationHeader
      } // fetch the current token owner 
    })
    .then((response) => {
      login = response['data'].login;
      userId = response['data'].id;
      avatar = response['data'].image.link;
    })  // save the token owner info 
    .catch(() => {
      this.logger.error('An Error in 42 API');
      throw new HttpException('Authorization failed with 42 API', HttpStatus.UNAUTHORIZED);
    });

  const hashedSecret = await this.generateHashSecret(secret);
  // return await this.generateUser(login, +userId, hashedSecret, res, avatar);
}

  // generate hash 
  //Hashing alone is not sufficient to mitigate more involved attacks such as rainbow tables. 
  //A better way to store passwords is to add a salt to the hashing process: adding additional random data 
  //to the input of a hashing function that makes each password hash unique. 
  //The ideal authentication platform would integrate these two processes, hashing and salting, seamlessly.
  //At Auth0, the integrity and security of our data are one of our highest priorities. 
  //We use the industry-grade and battle-tested bcrypt algorithm to securely hash and salt passwords. 
  async generateHashSecret(secret: string) {
		const saltOrRounds = 10;
		try {
			return await bcrypt.hash(secret, saltOrRounds);
		}
		catch (err) {
			this.logger.error(err);
		}
	}

  // signout 
  // signout(req: Request, response: Response) {
  //   response.clearCookie('token');
  //   return response.send({ message: 'Sign out succeeded' });
}
