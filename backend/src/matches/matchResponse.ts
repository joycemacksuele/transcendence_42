export class MatchResponse {
    id : number;
	profileName1: string;
	profileName2: string;
    player1Score: number;
	player2Score: number;
	winnerId: number;
    result: string;
	timeStamp: Date;

    constructor(
        id: number,
        profileName1: string,
        profileName2: string,
        player1Score: number,
        player2Score: number,
        winnerId: number,
        result: string,
        timeStamp: Date,
    ){
        this.id = id;
        this.profileName1 = profileName1;
        this.profileName2 = profileName2;
        this.player1Score = player1Score;
        this.player2Score = player2Score;
        this.winnerId = winnerId;
        this.result = result;
        this.timeStamp = timeStamp;
    }
}