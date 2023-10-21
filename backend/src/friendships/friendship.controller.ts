import { Controller, Post, Body, Param} from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Post(':userId/addFriend/:friendId')
	async addFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<any> {
		return this.friendshipService.addFriend(userId, friendId);
	}
}
