import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

/*
	jaka, installed:
		npm install @nestjs/passport passport passport-jwt     
		npm i --save-dev @types/passport-jwt
*/


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.secret,
		});
	}
	async validate(payload: any) {
		return { loginName: payload.username };
	}
} 
