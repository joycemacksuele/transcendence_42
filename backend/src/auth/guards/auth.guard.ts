<<<<<<< HEAD
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
=======
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
>>>>>>> jaka
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "./auth.openaccess";

// Guards are implemented globally. Every controller has to go through the token verification. 
<<<<<<< HEAD
// The only exceptions are Auth('login') and Auth('token'). These have a private decorator @OpenAccess that allows them to work without being authorized. 

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService, 
        private reflector: Reflector) {}
    logger: Logger = new Logger('Auth Guard');
    
    // if the class that is used is OpenAccess then it will allow access otherwise it will proceed to verify the JWT token
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('AuthGuard function');        
=======
// The only exceptions are Auth('login') and Auth('token'). These have a private decorator @OpenAccess that allows them to work without being authorized.  

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector){
        console.log('AuthGuard controler');

    }

    
    // if the class that is used is OpenAccess then it will allow access otherwise it will proceed to verify the JWT token
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('AuthGuard function');
        
>>>>>>> jaka
        
        const open = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
<<<<<<< HEAD
        if (open)
            return true;

        // decode and verify the JWT token   
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        console.log('Token Auth Guard: ' + token);
        
=======
        console.log('Jaka, AuthGuard controler A)');
        if (open)
            return true;

        console.log('Jaka, AuthGuard controler B)');

        // decode and verify the JWT token   
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        console.log('Token: ' + token);
>>>>>>> jaka
        if (!token){
            throw new UnauthorizedException();
        }
        try{
            const payload = await this.jwtService.verifyAsync(
<<<<<<< HEAD
            token, {secret: process.env.SECRET}
=======
            token, {secret: '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'}
>>>>>>> jaka
            )               // returns the decoded payload with the user info 
            request['user'] = payload;
            console.log(payload);
        }
        catch{
            throw new UnauthorizedException();
        }   
        return true;     
    }

<<<<<<< HEAD
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

    // extractTokenFromHeader(request: Request): string | undefined{
    //     let token: string;
    //     let type: string;

    //     // token = request.get('Cookie');
    //     token = request.cookies;
    //     console.log('tester1: ' + token);
    //     type = token.split('Bearer ')[1];
    //     console.log('extracted token: ' + type);
    //     if (token === type)
    //         return token;
    //     return undefined;
    // }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
=======
    extractTokenFromHeader(request: Request): string | undefined{
        let token: string;
        let type: string;

        token = request.get('cookie');
        type = token.split('Bearer ')[1];
        if (token === type)
            return token;
        return undefined;
    }
>>>>>>> jaka
}