import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { MatchService } from "./match.service";
import { MatchDto } from "./match.dto";
import { UserService } from "src/user/user.service";

@Controller('matches')
export class MatchController {
	constructor(private readonly matchService: MatchService,
				private readonly userService: UserService	
	) {}

	@Post('/add-match')
	async addMatch(@Body() MatchDto: MatchDto) { // todo: check if in body?
		// console.log('Controller: Post add-match');
		return this.matchService.createMatch(MatchDto);
	}


	// todo jaka: should detect the current user from decorator. Unless we need to display history for every friend ???
	// @Get('/history/:userId')
	// async getMatchHistory(@Param('userId') userId: number) {
	// 	console.log('Fetching /matches/history:1');
	// 	return await this.matchService.getMatchHistory(userId);
	// }
	// @Get('/history/:userId')
	// async getMatchHistory(@Param('userId') userId: number) {
	// 	console.log('Fetching /matches/history, userID: ', userId);
	// 	return await this.matchService.getMatchHistory(userId);
	// }

	@Get('/history/:loginName')
	async getMatchHistoryByLoginName(@Param('loginName') loginName: string) {

		const user = await this.userService.getUserByLoginName(loginName);

		console.log('Fetching /matches/history, USER ID: ', user.id);
		return await this.matchService.getMatchHistoryByUserId(user.id);
		// return await this.matchService.getMatchHistoryByLoginName(loginName);
	}
}
