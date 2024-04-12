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

	@Get('/history/:loginName')
	async getMatchHistoryByLoginName(@Param('loginName') loginName: string) {

		const user = await this.userService.getUserByLoginName(loginName);

		console.log('Fetching /matches/history, USER ID: ', user.id);
		return await this.matchService.getMatchHistoryByUserId(user.id);
		// return await this.matchService.getMatchHistoryByLoginName(loginName);
	}

	@Get('/recalculateRanks')
	async updateAllRanks(@Res() res: Response) {
		await this.matchService.recalculateRanks();
	}
}
