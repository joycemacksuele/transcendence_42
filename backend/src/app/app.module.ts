/*
  This is the main file for the core of the AppModule.
  Here you can import other modules.
  Path must match, but it can be without .ts suffix
*/

/*
  TypeOrm
  TypeOrm is an Object Relational Mapper (ORM) typescript package that allows you to use both SQL
  such as PostgreSQL, MySQL and NoSQL databases. More about typeorm is in its documentation.
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from '../database/database.module';
import { DatabaseController } from '../database/database.controller';

import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MyUser } from '../user/user.entity';

import { ExampleController } from '../example.controller';
import { ExampleButton } from '../exampleButton.controller';
// import { AuthController } from 'src/auth/auth.controller';
// import { AuthService } from 'src/auth/auth.service';
import { TestButton } from 'src/test_button/test.controller';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      // Database configuration
      type: 'postgres',
      host: 'postgres_db', // Replace with the appropriate hostname if needed
      port: 5432,
      // username: 'jaka',
      username: 'transcendence_user',
      password: '***REMOVED***',
      database: 'mydb',
      entities: [MyUser],
      synchronize: true,
    }),
    
    TypeOrmModule.forFeature([MyUser]),
    DatabaseModule
  ],

  controllers: [
      AppController,
      UserController,
      DatabaseController,
      UserController,
      // AuthController,
      TestButton,
      ExampleController,
      ExampleButton
  ],
                
  providers: [
      AppService,
      UserService,
      UserRepository,//https://stackoverflow.com/questions/72680359/nestjs-entitymetadatanotfounderror-no-metadata-for-repository-was-found
      // AuthService
  ],
})
export class AppModule {
    constructor() {
        console.log('[BACKEND LOG] AppModule constructor');
    }
}
