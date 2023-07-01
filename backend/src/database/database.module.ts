// Importing necessary classes Module and TypeOrmModule from 
// packages/libraries common and typeorm

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Console from "console";

/*
	AppModule is the core module of the application, the entry point for configuring the application.
	
	@Module() is a 'decorator'

	'imports' is an array within a module definintion
	TypeOrmModule.forRoot() is a function, it takes parameters,
	such as configuration options.
	It returnes an instance of a TypeOrmModule
	
	By calling TypeOrmModule.forRoot() with the appropriate configuration, you enable the integration of TypeORM with your Nest.js application and make the configured database connection available throughout your application for database operations.
*/

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST || 'localhost',
			port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
			username: process.env.POSTGRES_USER || 'postgres',
			password: process.env.POSTGRES_PASSWORD || 'postgres',
			database: process.env.POSTGRES_DB || 'mydb',
			autoLoadEntities: true,
			synchronize: true,
		}),
	],
})
export class DatabaseModule {
	constructor() {
		Console.log('LOG DatabaseModule constructor');
	}
}
