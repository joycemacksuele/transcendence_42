import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

/*
	After each match we create a new instance of MatchEntity and fill in the details, ie: the players, scores...
	Then we save this MathcEntity to the database.

	For retrieving match histories we query the MatchEntity and 'join' it with the UserEntity to info about the players in each match.

	ManyToOne decorator creates a relationship between the MatchEntity and the UserEntity.
	Player1 and Player2 in MatchEntity are linked to the UserEntity via the ManyToOne relationship. This means that each match record will reference two user records, representing the players in that match.

	*/

@Entity()
export class MatchEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity)
	player1: UserEntity;

	@ManyToOne(() => UserEntity)
	player2: UserEntity;

	@Column()
	profileName1: string;

	@Column()
	profileName2: string;

	@Column()
	player1Score: number;

	@Column()
	player2Score: number;

	@Column()
	winnerId: number;

	@Column()
	timeStamp: Date;
}
