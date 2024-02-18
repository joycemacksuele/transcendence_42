import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Friendship } from "./friendship.entity";
import { UserEntity } from "src/user/user.entity";

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
			throw new BadRequestException("wrong message: This should never show up, because if the displayed profile is already a friend, it should on click just un-follow this user, and maybe? return to the list of friends");
		}

		const friendship = new Friendship();
		friendship.userId = userId;
		friendship.friendId = friendId;
		return this.friendshipRepository.save(friendship);
	}

	async removeFriend(userId: number, friendId: number): Promise<any> {
		if (userId === friendId) {
			throw new BadRequestException("You can't remove yourself as a 'followed user'");
		}
		const followedUser = await this.friendshipRepository.findOne({
			where: { userId, friendId }
		});

		if (!followedUser) {
			throw new NotFoundException("This user is not followed by you");
		}

		return this.friendshipRepository.remove(followedUser);

	}

		// THIS SHOULD FIND IF ONE FRIENDSHIP EXISTS
		async followingExists(userId: number, friendId: number): Promise<boolean> {
			const followingExists = await this.friendshipRepository.findOne({
				where: { userId, friendId }
			});

			// !! DOUBLE !! CONVERST TO BOOLEAN, IF A VARIABLE IS NULL OR EXISTING
			return !!followingExists;
	  	}


	async getFriendsOfUser(userId: number): Promise<UserEntity[]> {

		console.log(`Fetching friends for userId: ${userId}`);

		// STEPS IN THE QUERY
		// 1. create query builder()
		// 2. join ...
		// 3. where the conditions ...
		// 4. select 
		const friendships = await this.friendshipRepository
			.createQueryBuilder('friendship')
			// .innerJoin('user_entity', 'friend', 'friend.id = friendship.friendId')
			.innerJoinAndSelect('friendship.friend', 'friend')
			.where('friendship.userId = :userId', { userId })
			// .select(['friend.id'])
			// 		'friend.profileName',
			// 		'friend.profileImage',
			// 		'friend.onlineStatus',
			// 		'friend.rank',
			// 		'friend.gamesPlayed', 
			// 		'friend.gamesWon', 
			// 		'friend.gamesLost'
			// ])
			.getMany();

		// TEST SIMPLE QUERY
		// const friendships = await this.friendshipRepository.find({ where: { userId } });

		// console.log("Generated SQL: ", this.friendshipRepository
		// 	.createQueryBuilder('friendship')
		// 	.innerJoin('user_entity', 'friend', 'friend.id = friendship.friendId')
		// 	.where('friendship.userId = :userId', { userId })
		// 	.getQuery());

		/*
			Fetching friends for userId: 1
			backend   | Generated SQL:  SELECT "friendship"."id" AS "friendship_id", "friendship"."userId" AS "friendship_userId", "friendship"."friendId" AS "friendship_friendId" FROM "friendship" "friendship" INNER JOIN "user_entity" "friend" ON "friend"."id" = "friendship"."friendId" WHERE "friendship"."userId" = :userId
			backend   | Retrieved friendships:  [
			backend   |   Friendship { id: 2, userId: 1, friendId: 3 },
			backend   |   Friendship { id: 3, userId: 1, friendId: 4 },
			backend   |   Friendship { id: 1, userId: 1, friendId: 5 },
			backend   |   Friendship { id: 4, userId: 1, friendId: 6 }
			backend   | ]
		*/

		// console.log('Retrieved friendships: ', friendships);
		

		// The variable 'friendship' has to await to resolve the Promise
		// Then it gets the array of entities Friendship[].
		// The .map will extract from each item in the friendships[] array only the 'friend' entity, which is in fact the UserEntity 
		return (await friendships).map(friendship => friendship.friend);
	}
}
