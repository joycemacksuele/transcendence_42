import { Injectable, NestMiddleware, UnauthorizedException, HttpException, HttpStatus} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { Logger } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
// import { NextRequest, NextResponse } from 'next/server';  // to uninstall 

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService) {}
        logger: Logger = new Logger('AuthMiddleware');
    
  async use(request: Request, response: Response, next: NextFunction) {

    this.logger.log('Enter the AuthMiddleware');
    let token: string;

    try{
        token = this.authService.extractTokenFromHeader(request);
        // if (request.path === "/users/all")
            // token = ""; // TEST
        this.logger.log("ExistingToken: " + token);
    }catch(err){
        throw new UnauthorizedException('Player not authorized! Exiting Ping Pong!' + err);
    }
    if (token === ""){
        this.logger.log("Empty token"); 
        response.clearCookie('Cookie');
        this.logger.log("Empty string token: " + token);
        throw new UnauthorizedException('Player not authorized! Exiting Ping Pong!');
    }

    try{
        // decode the token 
        const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
        request['user'] = payload;

        // verify expiry date of the token         
        let expiry = await this.tokenExpired(payload.exp);
        let player : UserEntity;

        if (expiry === true){
            try {
                this.logger.log("Token has expired. Starting the process to get a new one!")
                player = await this.userService.getUserByLoginName(payload.username);
                let refreshToken = player.refreshToken;
                this.logger.log("Refresh token: " + refreshToken);
                this.logger.error(" ??? After this, the token becomes 'default', if the app is stopped without logging out, throwing error: jwt malformed (from jwtService.verifyAsync) ... ");

                const payloadRefreshToken = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_SECRET});
                let expiryRefreshToken = await this.tokenExpired(payloadRefreshToken.exp);
                this.logger.log("expiry refreshtoken: ", expiryRefreshToken);
                if (expiryRefreshToken === true)
                {
                    this.logger.log('No refresh token! Go away!');
                    response.clearCookie('Cookie');
    			    await this.userService.updateRefreshToken(player.loginName, "default");
                    throw new UnauthorizedException('Player not authorized! Exiting Ping Pong! - Expired refresh token');
                }

                // make a new refresh token 
                let newRefreshToken = await this.authService.signRefreshToken(player);
			    this.logger.log("New refreshToken: " + newRefreshToken);
			    await this.userService.updateRefreshToken(player.loginName, newRefreshToken);
			    this.logger.log('New refresh token set in the database');

                // create new authorization token 
                let replaceToken = await this.authService.signToken(player);
                const cookieAttributes = {
		        	httpOnly: true,
		        	path: '/',
			        sameSite: 'none',
		        };
		        let cookieToken = `token=${replaceToken};`;
                for (let attribute in cookieAttributes) {
			        if (cookieAttributes[attribute] === true) {
				        cookieToken += ` ${attribute};`;
			        } else
				        cookieToken += ` ${attribute}=${cookieAttributes[attribute]};`;
		        }
                this.logger.log("New Authorization Token: " + replaceToken);

                // add the new token to the response header
                response.clearCookie('Cookie');
                response.append('Set-Cookie', cookieToken);
                this.logger.log('Replaced token in header');
            }catch(err){
                this.logger.log('Error in refreshing tokens ' + err);
                throw new UnauthorizedException('Player not authorized! Exiting Ping Pong!' + err);
            }
        }
        else{
            this.logger.log('Token still valid. Exiting the function!');
        }
    }catch(err){
        this.logger.log('General error AuthMiddleware: ' + err);
        throw new UnauthorizedException('Player not authorized! Exiting Ping Pong!' + err);
    }
    next()
  }

  async tokenExpired(expiryDate: number): Promise<boolean> {
      let timeNow = new Date();
      if (timeNow.valueOf() > expiryDate) // token is expired 
          return true;
      return false;
  }
}

