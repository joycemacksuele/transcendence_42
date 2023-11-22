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
            // throw new UnauthorizedException(); // jaka temp disabled
        }
        try{
            console.log("START TRY !!!!!!!!!!!!!!!");
            const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
            console.log("AFTER PAYLOAD !!!!!!!!!!!!!!!");

            // token, {secret: process.env.SECRET}
            // returns the decoded payload with the user info 

            request['user'] = payload;
            console.log("Payload: " , payload);
            
            // if (token expired)
            // {
            //     if (refresh token exists in database){
            //         make new access token 
            //         make new refresh token
            //         set up request['user'] = payload;
            //         console.log("Payload: " , payload);
            //     } 
            //     else
            //         return false 
            // }
            // else
            // {
            //     request['user'] = payload;
            //     console.log("Payload: " , payload);
            // }
        }
        catch{
            // throw new UnauthorizedException(); jaka temp disabled
        }   
        return true;     
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
            // throw new UnauthorizedException(); jaka temp disabled
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