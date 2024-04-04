import { IsInt, IsNotEmpty, Min, Max, IsString, IsDate } from 'class-validator';

export class MatchDto {
	@IsInt()
	@IsNotEmpty()
	player1Id: number;

    @IsInt()
	@IsNotEmpty()
	player2Id: number;

	@IsString()
	profileName1: string;

	@IsString()
	profileName2: string;

	@IsInt()
    player1Score: number;
    
	@IsInt()
	player2Score: number;

	@IsInt()
	winnerId: number;
    
	// todo jaka: do we need timestamp ?
	@IsNotEmpty()
	// @IsDate()
	timeStamp: Date;
}