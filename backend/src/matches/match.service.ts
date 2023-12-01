import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserRepository } from "src/user/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchDto } from "./match.dto"
import { MatchEntity } from "./match.entity"
import { UserEntity } from "src/user/user.entity";


/*
	Jaka: Additional TODO

    - Implement Global Validation Pipe in main.ts for automatic validation.
    - Check if DTOs can be used elsewhere
    - Chek if all endpoints are properly secured, ie. with authentication and authorization ...
    - How to regularly update the dependencies

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


	async createMatch(matchDto: MatchDto): Promise<MatchEntity> {
		try {
			console.log(' --------------------------- Create Match()');
			console.log(' --------------------------- player1Id: ', matchDto.player1Id);
			const player1 = await this.userRepository.findOne({ where: { id: matchDto.player1Id } });
			const player2 = await this.userRepository.findOne({ where: { id: matchDto.player2Id } });
			
			if (!player1 || !player2) {
				throw new BadRequestException('One or both players not found');
			}
			
			console.log(' --------------------------- Create Match()', matchDto);
			const match = new MatchEntity();
			match.player1 		= player1;
			match.player2 		= player2;
			match.profileName1	= player1.profileName;
			match.profileName2	= player2.profileName;
			match.player1Score 	= matchDto.player1Score;
			match.player2Score 	= matchDto.player2Score;
			match.winnerId		= matchDto.winnerId;
			// match.timestamp		= matchDto.timestamp;

			return await this.matchRepository.save(match);
		} catch (error) {
			throw new InternalServerErrorException('Error creating Match.', error);
		}
	}


	// Fetch all matches that include this userId?
	async getMatchHistory(userId: number): Promise<MatchEntity[]> {
		// const matches = await this.matchRepository.find({ 
		// 	where: [
		// 		{ player1: { id: userId } },
		// 		{ player2: { id: userId } }
		// 	],
		// 	relations: ['player1', 'player2'] 
		// });
		// console.log('Matches found: ', matches);
		// return matches;
		
		// const matches = await this.matchRepository.createQueryBuilder('match')
		// .where('match.player1Id = :userId OR match.player2Id = :userId', { userId })
		// .getMany();

		const matches = await this.matchRepository.createQueryBuilder('match').getMany();
			
		console.log('Matches found: ', matches);
		return matches;
	}
}