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
import { UserService } from '../user/user.service';
import { ExampleController } from '../example.controller';   // added jaka
import { ExampleButton } from '../exampleButton.controller';   // added jaka

// Import newly created database Controller and Entity
import { DatabaseController } from '../database/database.controller';
import { UserController } from '../user/user.controller';
import { myUser } from '../user/user.entity';
import Console from "console";

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      // Database configuration
      type: 'postgres',
      host: 'postgres_db', // Replace with the appropriate hostname if needed
      port: 5432,
      // username: 'jaka',
      username: 'transcendence_user',
      password: 'novogeslo1',
      database: 'mydb',
      entities: [myUser],
      synchronize: true,
    }),
    
    TypeOrmModule.forFeature([myUser]),
    DatabaseModule,
  ],

  controllers: [
      AppController,
      ExampleController,
      ExampleButton,
      DatabaseController,
      UserController
  ], // added jaka
                
  providers: [
      AppService,
      UserService
  ],
})
export class myAppModule {
    constructor() {
        Console.log('LOG myAppModule constructor');
    }
}
