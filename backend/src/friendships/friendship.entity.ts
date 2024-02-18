import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('friendship')
@Unique(['userId', 'friendId']) // prevent a duplicate friendship with same person



/*
	This is a table with 2 columns, that represent the sender of friend request (userId) and the receiver (friendId)

	Each row represents 1 friend relationship:
		userid           friendid
		10                   20
		11                   20
		10                   21
		11                   21
*/

export class Friendship {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;	// The ID of the follower

	@Column()
	friendId: number;

	/*
		The @ManyToOne indicates that multiple Friendship records (many friendships) can 'link back' to a single UserEntity (one user-sender) as the sender of those friend requests. So, a single user can send many friend requests to different users, creating multiple friendship records where they are the userId.
	*/
	@ManyToOne(() => UserEntity, user => user.friendships)
	@JoinColumn({ name: 'userId' }) // link from userID column in Friendship table to ID column in UserEntity table
	user: UserEntity;				// The user who SENDS the friend request


	/*
		This indicates that multiple Friendship records (many friendships) can 'link back' to a single UserEntity (one user-receiver) as the receiver of those friend requests.
	*/
	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'friendId' })	// link from friendId column in Friendship table to ID column in UserEntity table
	friend: UserEntity;					// the user who RECEIVES the friend request
}
