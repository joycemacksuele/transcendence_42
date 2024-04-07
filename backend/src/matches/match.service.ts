import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserRepository } from "src/user/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchDto } from "./match.dto"
import { MatchResponse } from "./matchResponse";
import { MatchEntity } from "./match.entity"
import { UserEntity } from "src/user/user.entity";
import { all } from "axios";


/*
	Jaka: Additional TODO

    - Implement Global Validation Pipe in main.ts for automatic validation.
    - Check if DTOs can be used elsewhere
    - Chek if all endpoints are properly secured, ie. with authentication and authorization ...
    - How to regularly update the dependencies



	Important Considerations:

    - Fetching users, sorting, and updating can be performance-intensive for a large number of users. 
    - ??? Transaction Management: how to use transactions to ensure that all rank updates are applied consistently, especially if the application is doing concurrent match updates?
    - Caching Ranks: If ranks are frequently accessed but not often updated (e.g., only after each match), consider caching the ranks to improve performance.
	- How to retry the operation in case of a temporary database connection issue ???
*/

@Injectable()
export class MatchService {
	constructor(
		@InjectRepository(MatchEntity)	
		private readonly matchRepository: Repository<MatchEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
		// private readonly userRepository: UserRepository
	) {}


	async createMatch(matchDto: MatchDto): Promise<{ match: MatchEntity, message: string }> {
		console.log('START CREATE MATCH');
		try {
			// console.log(' --------------------------- Create Match()');
			// console.log(' --------------------------- player1Id: ', matchDto.player1Id);
			const player1 = await this.userRepository.findOne({ where: { id: matchDto.player1Id } });
			const player2 = await this.userRepository.findOne({ where: { id: matchDto.player2Id } });
			
			if (!player1 || !player2) {
				throw new BadRequestException('One or both players not found');
			}
			
			// console.log(' --------------------------- Create Match(), matchDTO: ', matchDto);
			const match = new MatchEntity();
			match.player1 		= player1;
			match.player2 		= player2;
			match.profileName1	= player1.profileName;
			match.profileName2	= player2.profileName;
			match.player1Score 	= matchDto.player1Score;
			match.player2Score 	= matchDto.player2Score;
			match.winnerId		= matchDto.winnerId;
			match.timeStamp		= new Date(matchDto.timeStamp);

			await this.matchRepository.save(match);
			await this.updatePlayerStats(player1, player2, matchDto.winnerId);
			await this.recalculateRanks();
			await this.updateAchievements(player1, player2, matchDto.winnerId);
			console.log('   --- Match created succesfully');
			return { match,
					 message: "Match created succesfully"
			};
		} catch (error) {
			throw new InternalServerErrorException('Error creating Match.', error);
		}
	}

	private async updateAchievements(player1: UserEntity, player2: UserEntity, winnerId: number ) : Promise<void> {
		
        this.addAchievements(player1);
        this.addAchievements(player2);
		await this.userRepository.save(player1);
        await this.userRepository.save(player2);
	}

    private addAchievements(player: UserEntity) {
        if (player.gamesPlayed == 1)
            player.achievements += ", Player"
        else if (player.gamesPlayed == 5)
            player.achievements += ", Veteran"
        if (player.gamesWon == 1 && !player.achievements.includes("Happy Day"))
            player.achievements += ', Happy Day';
        else if (player.gamesWon == 2 && !player.achievements.includes("Stardoom Devotion"))
            player.achievements += ', Stardoom Devotion';
        else if (player.gamesWon == 3 && !player.achievements.includes("Zen"))
            player.achievements += ', Zen';
        if (player.gamesLost == 1 && !player.achievements.includes("Happens"))
            player.achievements += ', Happens';
        else if (player.gamesLost == 2 && !player.achievements.includes("Unlucky"))
            player.achievements += ', Unlucky';
        else if (player.gamesLost == 3 && !player.achievements.includes("Get Better"))
            player.achievements += ', Get Better';
    }


	private async updatePlayerStats(player1: UserEntity, player2: UserEntity, winnerId: number): Promise<void> {
		player1.gamesPlayed++;
		player2.gamesPlayed++;

		if (player1.id === winnerId) {
			player1.gamesWon++;
			player2.gamesLost++;
		} else {
			player1.gamesLost++;
			player2.gamesWon++;
		}
		await this.userRepository.save(player1);
		await this.userRepository.save(player2);
	}


	/*
		Sort all users by gamesWon from most to least. Then assign them the rank, starting from 1.
		If 2 players share the same gamesWon value, they get the same rank.
	*/
	// private async recalculateRanks(): Promise<void> {
	async recalculateRanks(): Promise<void> {
		const allUsers = await this.userRepository.find();
		allUsers.sort((a, b) => b.gamesWon - a.gamesWon);

		let currentRank = 1;
		let previousGamesWon = allUsers[0].gamesWon;
		for (const user of allUsers) {
			if (user.gamesWon === previousGamesWon) {
				user.rank = currentRank;
			} else {
				currentRank++;
				user.rank = currentRank;
				previousGamesWon = user.gamesWon;
			}
		}
		await this.userRepository.save(allUsers);
	}



	// Fetch all matches that include this userId?
	// async getMatchHistory(userId: number): Promise<MatchResponse[]> {
	// 	// const matches = await this.matchRepository.find({ 
	// 	// 	where: [
	// 	// 		{ player1: { id: userId } },
	// 	// 		{ player2: { id: userId } }
	// 	// 	],
	// 	// 	relations: ['player1', 'player2'] 
	// 	// });
	// 	// console.log('Matches found: ', matches);
	// 	// return matches;
		
	// 	// const matches = await this.matchRepository.createQueryBuilder('match')
	// 	// .where('match.player1Id = :userId OR match.player2Id = :userId', { userId })
	// 	// .getMany();

	// 	const matches = await this.matchRepository.createQueryBuilder('match').getMany();
	// 	const matchesResponse = matches.map(match =>
	// 		{
	// 			let result ="L";
	// 			if(match.winnerId == userId)
	// 				result = "W"
	// 			return new MatchResponse(
	// 				match.id,
	// 				match.profileName1,
	// 				match.profileName2,
	// 				match.player1Score,
	// 				match.player2Score,
	// 				match.winnerId,
	// 				result,
	// 				match.timeStamp
	// 			)
	// 		}
	// 	);
	// 	console.log('Matches found: ', matches);
	// 	return matchesResponse;
	// }
	

	async getMatchHistoryByUserId(userId: number): Promise<MatchResponse[]> {
		// const matches = await this.matchRepository.find({ 
		// 	where: [
		// 		{ player1: { id: userId } },
		// 		{ player2: { id: userId } }
		// 	],
		// 	relations: ['player1', 'player2'] 
		// });
		// console.log('Matches found: ', matches);
		// return matches;
		
		const matches = await this.matchRepository.createQueryBuilder('match')
		.where('match.player1Id = :userId OR match.player2Id = :userId', { userId })
		.getMany();
		const matchesResponse = matches.map(match =>
			{
				let result ="L";
				if(match.winnerId == userId)
					result = "W"
				return new MatchResponse(
					match.id,
					match.profileName1,
					match.profileName2,
					match.player1Score,
					match.player2Score,
					match.winnerId,
					result,
					match.timeStamp
				)
			}
		);
		// const matches = await this.matchRepository.createQueryBuilder('match').getMany();
			
		//console.log('Matches found for userId: ', userId);
		//console.log('Matches found: ', matches);
		return matchesResponse;
	}
}