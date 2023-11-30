// import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException, Logger } from "@nestjs/common";
// import { AuthService } from "../auth.service";
// import { Repository } from 'typeorm';
// import { CreateUserDto } from "src/user/create-user.dto";
// import { UserEntity } from "src/user/user.entity";
// import { JwtService } from "@nestjs/jwt";
// import { Request, Response } from 'express';
// import { Reflector } from "@nestjs/core";
// import { PUBLIC_KEY } from "./auth.openaccess";
// import { Express } from "express";
// import axios from 'axios';


// // Guards are implemented globally. Every controller has to go through the token verification. 
// // The only exceptions are Auth('login') and Auth('token'). These have a private decorator @OpenAccess that allows them to work without being authorized. 

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(
//         private jwtService: JwtService, 
//         private reflector: Reflector) {}
//     logger: Logger = new Logger('Auth Guard');
    
//     // if the class that is used is OpenAccess then it will allow access otherwise it will proceed to verify the JWT token
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         this.logger.log('Start AuthGuard function');        
        
//         const open = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         if (open)
//         {
//             this.logger.log('Open Access - no need for AuthGuard');
//             return true;
//         }

//         // decode and verify the JWT token   
//         const request = context.switchToHttp().getRequest();
//         let token = this.extractTokenFromHeader(request);
//         this.logger.log('Auth Guard - First decode: ' + token);

//         // ----------------------------------------
//         // const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
//         // let expiry1 = await this.tokenExpired(payload.exp);
//         // if (expiry1 === true)
//         // {
//         //     token = "";
//         //     console.log("replaced token with empty string: " + token);
//         // }

//         // I've had enough of you! Go away! 

//         // ---------------------------------------
//         if (!token || token === ""){
//             console.log("player must be thrown out !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//             throw new UnauthorizedException();  // player must be thrown out !!!!!!!!!!!!!!!!!!!!!!!!!!!!
//         }
//         try{
//             const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
//             request['user'] = payload;
//             console.log("Payload after first decode: " , payload);
//             let userName = payload.username;
//             console.log("payload.user: " + userName + ', payload.exp: ' + payload.exp);

//             let expiry = await this.tokenExpired(payload.exp);
//             let player : UserEntity;
//             if (expiry === true)
//             {
//                 console.log("Token is expired. Start new tokens: ------------------------------------" + expiry);
//                 // ----------------------------------------------- get user entity from database
//                 const paramName = new URLSearchParams();
//                 paramName.append('name', userName);
//                 await axios
//                 .post(`${process.env.BACKEND}/auth/getPlayer`, paramName)
//                 .then((response) => {
//                     player = response.data;
//                     this.logger.log('received player from first post request: ' + player.loginName); 				
//                 })
//                 .catch((error) => {
//                     this.logger.error('\x1b[31mUnable to get player entity: \x1b[0m');
//                     throw new HttpException('Unable to get player entity', HttpStatus.UNAUTHORIZED);
//                 });
                
//                 try{                
//                     let refreshToken = player.refreshToken;
//                     this.logger.log("Auth Guard - existing refresh token: " + refreshToken);
//                     if (refreshToken === 'default')
//                     {
//                         this.logger.error('\x1b[31mRefresh token unavailable. Player needs to log in again: \x1b[0m'); // throw you out to log in 
//                         return false;
//                     }
//                     const payloadRefreshToken = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_SECRET});
//                     let expiryRefreshToken = await this.tokenExpired(payloadRefreshToken.exp);
                    
//                     if (expiryRefreshToken === true) // refresh token is expired 
//                     {
//                         this.logger.error('\x1b[31mError refresh token is expired. Player needs to log in again. Exit function \x1b[0m');
//                         return false;
//                     }
                    
//                     // ----------------------------------------------- create and store new tokens

                   
//                     let cookies = request.get('Cookie'); // not needed
// 		            console.log("     verify cookie: " + cookies); // not needed
// 		            let existingToken = this.extractTokenFromHeader(request); // not needed
// 		            console.log("     existingToken: " + existingToken); // not needed

// 		            let replaceToken = await this.signToken(player);
//             		const cookieAttributes = {
// 		            	httpOnly: true,
// 			            path: '/',
// 			            sameSite: 'none',
// 		            };
// 		            let cookieToken = `token=${replaceToken};`;
// 		            for (let attribute in cookieAttributes) {
// 			            if (cookieAttributes[attribute] === true) {
// 				            cookieToken += ` ${attribute};`;
// 			            } else
// 				            cookieToken += ` ${attribute}=${cookieAttributes[attribute]};`;
// 		            }
//                     request.cookies('Set-Cookie', cookieToken);
	




//                     this.logger.log("verify again expired token before post : " + token);
//                     await axios
//                     .post(`${process.env.BACKEND}/auth/updateAuth`, paramName)
//                     .then((response) => {
//                         this.logger.log("return from update token: " + response.data);
//                         if (response.data === false)
//                             throw new HttpException('Something went terrible wrong with this header update', HttpStatus.UNAUTHORIZED);
//                     })
//                     .catch((err) => {
//                         this.logger.error('\x1b[31mUnable to update token in header: \x1b[0m');
//                         throw new HttpException('Unable to update token in header', HttpStatus.UNAUTHORIZED);
//                     });
//                     this.logger.log("Reached the end of getting new tokens in Auth Guard----------------------------");
//                 }
//                 catch(err){
//                     this.logger.error('\x1b[31mUPlayer does not exist in the database: \x1b[0m' + err);
//                     throw new UnauthorizedException();
//                 }         
//             }
//             else{
//                 console.log("Token not expired. Exit Function------------------------------------- " + expiry );
//             }
//         }
//         catch(err){
//             this.logger.error('\x1b[31mGeneral error: Unable to pass the Auth Guard: \x1b[0m');
//             throw new UnauthorizedException();
//         }   
//         return true;     
//     }

//     async tokenExpired(expiryDate: number): Promise<boolean> {
//         let timeNow = new Date();
//         // this.logger.log("tokenExpired function: expiryDate" + expiryDate + ' timeNow: ' + timeNow);
//         if (timeNow.valueOf() > expiryDate) // token is expired 
//         {
//             // this.logger.log("return true if expired");
//             return true
//         }
//         // this.logger.log("return false if not expired");
//         return false;
//     }

//     // ADDED JAKA:
//     // THE FUNCTION extractUserFromToken() DOES NOT WORK IN OTHER FILES OUTSIDE auth.guards
//     // BECAUSE 'CONTEXT' IS NOT AVAILABLE THERE.
//     // AND ALSO, 'AUTHGUARDS' CANNOT BE INJECTED INTO A CONTROLLER
//     // THEREFORE, I WROTE  A SIMILAR FUNCTION INSIDE auth.service
//     // ALSO, IT NEEDS TO HAVE AS AN ARGUMENT A 'REQUEST' INSTEAD OF 'CONTEXT'
//     async extractUserFromToken(context: ExecutionContext) {

//         const open = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         const request = context.switchToHttp().getRequest();
//         const token = this.extractTokenFromHeader(request);

//         if (!token){
//             throw new UnauthorizedException();
//         }
//         try{
//             const payload = await this.jwtService.verifyAsync(
//             token, {secret: process.env.SECRET}
//             )
//             request['user'] = payload;
//             console.log(payload);
//         }
//         catch{
//             throw new UnauthorizedException();
//         }
//         return (request['user']);
//     }

//     extractTokenFromHeader(request: Request): string | undefined{
//         let cookie: string;
//         let token: string;

//         cookie = request.get('Cookie');
//         if (!cookie)
//             return undefined;
//         var arrays = cookie.split(';');
//         // console.log("arrays: " + arrays);
//         for (let i = 0; arrays[i]; i++)
//         {
//             if (arrays[i].includes("token="))
//             {
//                 token = arrays[i].split('token=')[1];
//                 break ;
//             }
//         }
//         // console.log('token: ' + token);
//         return token;
//     }

//     async signToken(player: CreateUserDto) {
// 		let token: string;

// 		let expiryDate = new Date();
// 		expiryDate.setMinutes(expiryDate.getMinutes() + 1);
// 		console.log("expiry date: " + expiryDate);

// 		let time = expiryDate.valueOf();
// 		console.log("time: " + time);

// 		const payload = { sub: player.intraId, username:player.loginName, exp: time };  // https://docs.nestjs.com/security/authentication
// 		try {
// 			token = await this.jwtService.signAsync(payload, {
// 				secret: process.env.JWT_SECRET
// 			});
// 		}
// 		catch (err) {
// 			throw new HttpException('Signing JWT token failed.', HttpStatus.SERVICE_UNAVAILABLE);
// 		}
// 		return token;
// 	}
// }
