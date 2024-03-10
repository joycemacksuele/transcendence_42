import { Controller, Get, Post, Body, Param, Res, Logger } from "@nestjs/common";
import { Response } from "express";
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


	// Todo: To be removed (jaka):
	// 		Prevent creating more dummy matches, if they already exists.
	//		Assuming that there is always a dummy with id === 2 
	//		If any match already exist, no matter which ID -> exit
	@Get('/check-if-dummy-matches-exist')
		//   WITH A Promise<>
	// async checkIfDummyMatchesExists(): Promise<{ matchExists: number }>  {
		// WITH A @Res
		async checkIfDummyMatchesExists(@Res() res: Response)  {
		const dummy_match = await this.matchService.getMatchHistoryByUserId(2);
		// console.log('dummyMatch.length:', dummy_match.length)

		res.json({ matchExists: dummy_match.length > 0 });
	}

}
