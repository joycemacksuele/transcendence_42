import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";

@Injectable()
export class ConfigService {
	constructor(private readonly configService: ConfigService) {}
	logger: Logger = new Logger('2fa mail services');

	// async get(name: string) {

	// 	let var = ;


	// 	return var;
	// }
}