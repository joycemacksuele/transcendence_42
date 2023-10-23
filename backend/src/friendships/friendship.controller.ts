import { Controller, Post, Get, Body, Param} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { UserEntity } from 'src/user/user.entity';
// import { Friendship } from './friendship.entity';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Post(':userId/addFriend/:friendId')
	async addFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<any> {
		return this.friendshipService.addFriend(userId, friendId);
	};


	@Get(':userId/friends')
	async getFriendsOfUser(@Param('userId') userId: number): Promise<UserEntity[]> {
		return this.friendshipService.getFriendsOfUser(userId);
	}
}
