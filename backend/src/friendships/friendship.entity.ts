import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('friendship')
@Unique(['userId', 'friendId']) // prevent friendship with same person



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

	// @ManyToOne(() => UserEntity)
	@ManyToOne(() => UserEntity, user => user.friendships)
	@JoinColumn({ name: 'userId' })
	user: UserEntity;		// The user who SENDS the friend request

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'friendId' })	
	friend: UserEntity;		// the user who RECEIVES the friend request
}


/* SOMETHING WAS CAUSING ERROR:
	
	backend   | [BACKEND LOG] UserEntity constructor
	database  | 2023-10-20 12:39:57.918 UTC [71] ERROR:  duplicate key value violates unique constraint "pg_class_relname_nsp_index"
	database  | 2023-10-20 12:39:57.918 UTC [71] DETAIL:  Key (relname, relnamespace)=(friendship_id_seq, 2200) already exists.
	database  | 2023-10-20 12:39:57.918 UTC [71] STATEMENT:  CREATE TABLE "friendship" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "friendId" integer NOT NULL, CONSTRAINT "UQ_8ec05157173d01ac1497990a020" UNIQUE ("userId", "friendId"), CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))
	backend   | [Nest] 40  - 10/20/2023, 12:39:58 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +640ms
	backend   | [Nest] 40  - 10/20/2023, 12:39:58 PM   ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
	backend   | QueryFailedError: duplicate key value violates unique constraint "pg_class_relname_nsp_index"
	backend   |     at PostgresQueryRunner.query (/backend/src/driver/postgres/PostgresQueryRunner.ts:299:19)
	backend   |     at ...

		EXPLANATIONS:
		"The error message "duplicate key value violates unique constraint pg_class_relname_nsp_index" is related to PostgreSQL's internal system tables, specifically the pg_class table.

		In PostgreSQL, the pg_class table is a system catalog that stores metadata about tables, indexes, sequences, etc. The relname column in this table holds the name of these objects. The unique constraint pg_class_relname_nsp_index ensures that there are no duplicate names within a given namespace (nsp stands for namespace, which is typically a schema in PostgreSQL)."

		"The error duplicate key value violates unique constraint "pg_class_relname_nsp_index" typically indicates that there's an attempt to create a table or index with a name that already exists in the PostgreSQL system catalog."

		JAKA TRANSLATED: 
		Postgres has its own internal 'system' tables.
		It uses these tables to store its own data about tables, indexes, etc ...
		One of these tables is 'pg_class'. It has a column 'relname'. The 'relname' column stores names of objects ???
		These names must be unique.
		There was an attempt (by whom ???) to create a table or index with an existing name.
*/