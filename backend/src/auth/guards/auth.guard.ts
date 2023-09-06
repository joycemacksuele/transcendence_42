import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "./auth.openaccess";

// Guards are implemented globally. Every controller has to go through the token verification. 
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
        
        const open = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (open)
            return true;

        // decode and verify the JWT token   
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        console.log('Token Auth Guard: ' + token);
        
        if (!token){
            throw new UnauthorizedException();
        }
        try{
            const payload = await this.jwtService.verifyAsync(
            token, {secret: process.env.SECRET}
            )               // returns the decoded payload with the user info 
            request['user'] = payload;
            console.log(payload);
        }
        catch{
            throw new UnauthorizedException();
        }   
        return true;     
    }

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
}