
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friendship } from "./friendship.entity";
import { FriendshipController } from "./friendship.controller";
import { FriendshipService } from "./friendship.service";

@Module({
	imports: [TypeOrmModule.forFeature([Friendship])],

	providers: [FriendshipService],

	controllers: [FriendshipController],
})

export class FriendshipModule {}