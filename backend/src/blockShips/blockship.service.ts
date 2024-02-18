import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm" // ???
import { Blockship } from "./blockship.entity";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class BlockshipService {
	constructor(
		@InjectRepository(Blockship)
		private readonly blockshipRepository: Repository<Blockship>
	) {}


		async checkBlockedStatus(currUserId: number, checkId: number): Promise<boolean> {
			const blockship = await this.blockshipRepository.findOne({
				where: {
					blockerId: currUserId,
					blockedId: checkId,
				},
			});
			return !!blockship; // if exists --> ! false --> ! true
		}



	async blockUser(blockerId: number, blockedId: number): Promise<Blockship> {
		if (blockerId === blockedId) {
			throw new BadRequestException("You can't block yourself.");
		}

		const existingBlocked = await this.blockshipRepository.findOne({
			where: {blockerId, blockedId}
		});
		if (existingBlocked) {
			throw new BadRequestException("This should not happen, because the block button should already show that this user has been blocked, therefore not do anything");
		}
		const newBlockship = new Blockship();
		newBlockship.blockerId = blockerId;
		newBlockship.blockedId = blockedId;

		const savedBlockship = await this.blockshipRepository.save(newBlockship);
		return savedBlockship;
	}


	async unblockUser(blockerId: number, blockedId: number): Promise<void> {
		if (blockerId === blockedId) {
			throw new BadRequestException("Not possible to unblock yourself");
		}
		const existingBlockship = await this.blockshipRepository.findOne({
			where: { blockerId, blockedId }
		});
		
		if (!existingBlockship) {
			throw new BadRequestException("This Blockship does not exist");
		}
		await this.blockshipRepository.remove(existingBlockship);
	}


	async getBlockedIds(blockerId: number): Promise<number[]> {
		const blockships = await this.blockshipRepository.find({
			where: { blockerId: blockerId }
		});
		const blockedIds = blockships.map(blockship => blockship.blockedId);
		return blockedIds;
	}



	// async getBlockedUsers(blockerId: number): Promise<UserEntity[]> {
	// 	const blockships = await this.blockshipRepository.find({
	// 	  where: { blockerId: blockerId }
	// 	});
	
	// 	const blockedUserIds = blockships.map(blockship => blockship.blockedId);
	// 	const blockedUsers = await Promise.all(
	// 	  blockedUserIds.map(id => this.userService.getUserById(id)) // Assuming getUserById is a method in UserService
	// 	);
	
	// 	return blockedUsers;
	//   }



	// async getBlockedUsers(blockerId: number): Promise<UserEntity[]> {

	// 	console.log(`Fetching blocked users of userId: ${blockerId}`);

	// 	// variant A)
	// 	const blockships = await this.blockshipRepository
	// 		.createQueryBuilder('blockship')
	// 		.innerJoinAndSelect('blockship.blocked', 'blocked')
	// 		.where('blockship.blockerId = :blockerId', { blockerId })
	// 		.getMany();

	// 	// variant B)
	// 	// const blockships_B = await this.blockshipRepository.find({
	// 	// 	where: { blockerId: blockerId },
	// 	// 	relations: ['blocked'] 
	// 	// })

	// 	const blockedUsers = blockships.map(blockships => blockships.blocked);

	// 	return blockedUsers;
	// }
}