// Importing necessary classes Module and TypeOrmModule from 
// packages/libraries common and typeorm

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Tutorials
// Setting up Nestjs with PostgreSQL: https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe
// Build a Secure NestJS API with Postgres (and Auth with OKTA + cookies + photo controller): https://developer.okta.com/blog/2020/02/26/build-a-secure-nestjs-api-with-postgres

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
		console.log('[BACKEND LOG] DatabaseModule constructor');
	}
}
