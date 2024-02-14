import { Controller, Body, Request, Req, Post, Get, Param, ParseIntPipe, HttpException, HttpStatus } from "@nestjs/common";
import { BlockshipService } from "./blockship.service"
import { UserEntity } from "src/user/user.entity";
import { AuthService } from "src/auth/auth.service";
import  { UserService } from "src/user/user.service";

interface BlockResponse {
	success: boolean;
	message: string;
}

@Controller('blockship')
export class BlockshipController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly blockshipService: BlockshipService
	) {}


	@Post('/check-blocked-status')
	async checkBlockStatus(
			@Request() req,
			@Body('id-to-check') checkId: number
		): Promise<boolean> {
		
		let payload = await this.authService.extractUserdataFromToken(req);
		const currUser = await this.userService.getUserByLoginName(payload.username);
		
		const blockedStatus = await this.blockshipService.checkBlockedStatus(currUser.id, checkId);
		return blockedStatus;
	}



	@Post('/block-user')
	async blockUser(
			@Request() req,
			@Body('id-to-block') checkId: number
		): Promise<BlockResponse> {
	
		let payload = await this.authService.extractUserdataFromToken(req);
		const currUser = await this.userService.getUserByLoginName(payload.username);
		
		const blockedStatus = await this.blockshipService.checkBlockedStatus(currUser.id, checkId);
		console.log("Blocked status: ", blockedStatus);

		try {
			if (blockedStatus) {
				const createdBlockship = await this.blockshipService.unblockUser(currUser.id, checkId);
				return {
					success: true,
					message: "User successfully unblocked (blockship removed)."
					// createdBlockship  // no need to return the entity, not needed in the frontend
				};
			} else {
				const removedBlockship = await this.blockshipService.blockUser(currUser.id, checkId);
				return {
					success: true,
					message: "User is successfully blocked (blockship created)."
					// createdBlockship  // no need to return the entity, not needed in the frontend
				};
			}
		} catch (err) {
			throw new HttpException({
				success: false,
				message: "Failed to block/unblock the user, due to ...",
			}, HttpStatus.BAD_REQUEST);
		}
	}



	@Get('/get-blocked-ids')
	async getBlockedUsers(
		@Request() req
		): Promise<number[]> {

		const currUser = await this.userService.getUserByLoginName(req.user.username);
		// console.log("currUser.id: ", currUser.id);

		const blockedIds = await this.blockshipService.getBlockedIds(currUser.id);
		console.log("The user [" + currUser.loginName +  "] has blocked users (id's): " + blockedIds);
		return blockedIds;
	}

}