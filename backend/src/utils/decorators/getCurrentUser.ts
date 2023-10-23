/*
	Added Jaka:
	This extracts current user's data from jwt token. This is better practice than sending user's login in the request url 

	'GetCurrentUser' is a custom-made decorator, which can be used to extract the User object from jwt token (after the verification of the token).
	
	This decorator can be used in functions, like this:
		@Post('some-route')
		some-function(@GetCurrentUser() user: any { ... }
*/

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const GetCurrentUser = createParamDecorator(
	(data, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	} 
);

