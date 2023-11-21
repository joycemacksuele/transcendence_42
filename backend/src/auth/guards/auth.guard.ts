import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException, Logger } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express';
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "./auth.openaccess";
import axios from 'axios';


// Guards are implemented globally. Every controller has to go through the token verification. 
// The only exceptions are Auth('login') and Auth('token'). These have a private decorator @OpenAccess that allows them to work without being authorized. 

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private jwtService: JwtService, 
        private reflector: Reflector) {}
    logger: Logger = new Logger('Auth Guard');
    
    // if the class that is used is OpenAccess then it will allow access otherwise it will proceed to verify the JWT token
    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.log('Start AuthGuard function');        
        
        const open = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (open)
        {
            this.logger.log('Open Access - no need for AuthGuard');
            return true;
        }

        // decode and verify the JWT token   
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        this.logger.log('Token Auth Guard: ' + token);
        
        if (!token){
            throw new UnauthorizedException();
        }
        try{
            console.log("START TRY !!!!!!!!!!!!!!!");
            const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
            console.log("AFTER PAYLOAD !!!!!!!!!!!!!!!");

            request['user'] = payload;
            console.log("Payload: " , payload);

            let expiry = await this.tokenExpired(payload.exp);
            console.log("expiry? " + expiry);
            if (expiry === true)
            {
                this.logger.log("Token is expired. We will now create a new one");
                let player = await this.userService.getUserByLoginName(payload.username); // gets the entire entity 

                this.logger.log("player: " + player.profileName + ' intra nr: ' + player.intraId);
                console.log("test 1");
                try{      
                console.log("test 2");

                    let refreshToken = player.refreshToken;
                    if (refreshToken === 'default')
                        return false;
                    const payloadRefreshToken = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_SECRET});
                    let expiryRefreshToken = await this.tokenExpired(payloadRefreshToken.exp);
                    console.log("test 3");

                    // if (payloadRefreshToken === player.loginName && expiryRefreshToken === true) // refresh token is expired 
                    if (expiryRefreshToken === true) // refresh token is expired 
                    {
                        console.log("test 4");

                        this.logger.error('\x1b[31mError token is expired. Player needs to log in again: \x1b[0m');
                        return false;
                    }
                  
                    await axios
                    .post(`${process.env.BACKEND}/updateAuth`, token)
                    .then()
                    .catch((error) => {
                        this.logger.error('\x1b[31mUnable to update token in header: \x1b[0m');
                        throw new HttpException('Unable to update token in header', HttpStatus.UNAUTHORIZED);
                    });
                console.log("test 5");

                }
                catch(err){
                    this.logger.error('\x1b[31mUPlayer does not exist in the database: \x1b[0m');
                    throw new UnauthorizedException();
                }         
            }
        }
        catch(err){
            this.logger.error('\x1b[31mUnable to pass the Auth Guard: \x1b[0m');
            throw new UnauthorizedException();
        }   
        return true;     
    }

    async tokenExpired(expiryDate: number): Promise<boolean> {
        let timeNow = new Date();
        this.logger.log("expiry function: expiryDate" + expiryDate + ' timeNoqw: ' + timeNow);
        if (timeNow.valueOf() > expiryDate) // token is expired 
        {
            this.logger.log("return true if expired");
            return true
        }
        this.logger.log("return false if not expired");
        return false;
    }

    // ADDED JAKA:
    // THE FUNCTION extractUserFromToken() DOES NOT WORK IN OTHER FILES OUTSIDE auth.guards
    // BECAUSE 'CONTEXT' IS NOT AVAILABLE THERE.
    // AND ALSO, 'AUTHGUARDS' CANNOT BE INJECTED INTO A CONTROLLER
    // THEREFORE, I WROTE  A SIMILAR FUNCTION INSIDE auth.service
    // ALSO, IT NEEDS TO HAVE AS AN ARGUMENT A 'REQUEST' INSTEAD OF 'CONTEXT'
    async extractUserFromToken(context: ExecutionContext) {

        const open = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token){
            throw new UnauthorizedException();
        }
        try{
            const payload = await this.jwtService.verifyAsync(
            token, {secret: process.env.SECRET}
            )
            request['user'] = payload;
            console.log(payload);
        }
        catch{
            throw new UnauthorizedException();
        }
        return (request['user']);
    }

    extractTokenFromHeader(request: Request): string | undefined{
        let cookie: string;
        let token: string;

        cookie = request.get('Cookie');
        if (!cookie)
            return undefined;
        var arrays = cookie.split(';');
        console.log("arrays: " + arrays);
        for (let i = 0; arrays[i]; i++)
        {
            if (arrays[i].includes("token="))
            {
                token = arrays[i].split('token=')[1];
                break ;
            }
        }
        console.log('token: ' + token);
        return token;
    }
}
