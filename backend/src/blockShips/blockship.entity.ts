import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

/*
	This is a table with 2 columns, that represent the initiator if the block (blockerId) and the target of block (blockerId)

	Each row represents 1 friend relationship:
		blockerId           blockedId
		1                   3
		2                   3
		1                   4
		2                   5
*/


@Entity('blockships_table')
@Unique(['blockerId', 'blockedId']) // prevent duplicate blockships with same user

export class Blockship {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	blockerId: number;

	@Column()
	blockedId: number;

	/*
		This set up enables that I can list all the 'blocked' users. 
		The 2nd function would only be useful if I also wanted to list the 'blockers', besides the 'blocked':
			@ManyToOne(() => UserEntity, user => user.blockedUsers)
	*/
	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'blockerId' })
	blocker: UserEntity;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'blockedId' })	
	blocked: UserEntity;
}


////////////////////////////////////////////////////////////
/*
	If in user.entity is only this (and no separate entity Blockship)
			@ManyToMany(() => UserEntity)
			@JoinTable()
			blockedUsers: UserEntity[];

	Then it is not known, who initiated the block.


*/
////////////////////////////////////////////////////////////

//Should UseGuards be everywhere or is it placed somewhere at the top to check ecerything?
// 		@Post('/block')
// 		@UseGuards(AuthGuard())  




// type safety

// user => user.friendships: The second argument of the @ManyToOne decorator is another arrow function used in the context of specifying the inverse side of a bidirectional relationship. 

// @ManyToOne(() => UserEntity, user => user.friendships)
// 		The target entity? Is in this case the User entity?
//		is this a variant of defining the relationship, in this case with 2 functions?
//		can there be none of kust 1 function?