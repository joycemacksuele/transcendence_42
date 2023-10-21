import { BadRequestException, Injectable } from "@nestjs/common";
import { Friendship } from "./friendship.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FriendshipService {
	constructor(
		@InjectRepository(Friendship)	
		private readonly friendshipRepository: Repository<Friendship>
	) {}

	async addFriend(userId: number, friendId: number): Promise<any> {
		if (userId === friendId) {
			throw new BadRequestException("You can't add yourself as a friend.");
		}

		const existingFriendship = await this.friendshipRepository.findOne({
			where: {userId, friendId }
		});
		if (existingFriendship) {
			throw new BadRequestException("This user is already your friend.");
		}
		
		const friendship = new Friendship();
		friendship.userId = userId;
		friendship.friendId = friendId;
		return this.friendshipRepository.save(friendship);
	}
}
