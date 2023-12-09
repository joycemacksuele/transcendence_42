/*
  This is the main file, together with app.module.ts. It is the entry point of the
  application, it attaches the 'AppModule' and creates an instance of 'NestApplication'.
*/

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from "typeorm";
// import { ConfigModule } from '@nestjs/config';
// import { AuthGuard } from './auth/guards/auth.guard';
// import { UnauthorizedExceptionFilter } from './auth/guards/auth.exception.filter';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import {Logger, ValidationPipe} from '@nestjs/common'

import mysql, { ConnectionOptions } from 'mysql2';

async function main() {
  let logger = new Logger(main.name);
  
  // const access: ConnectionOptions = {
  //   host:  'localhost',
  //   user: `${process.env.POSTGRES_USER}`,
  //   database: `${process.env.DATABASE}`,
  // };  


  // var connection = mysql.createConnection({
  //   host     : `${process.env.POSTGRES_HOST}`,
  //   user     : `${process.env.POSTGRES_USER}`,
  //   password : `${process.env.POSTGRES_PASSWORD}`,
  //   database : `${process.env.DATABASE}`,
  //   // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  // });
  // connection.connect();
  // // const connection = mysql.createConnection(access);



// const access: ConnectionOptions = {
//   user: `${process.env.POSTGRES_USER}`,
//   database: `${process.env.DATABASE}`,
// };
// let defaultPORT = 3306;
// const conn = mysql.createConnection(access);
// conn.connect();
  
  const app = await NestFactory.create(AppModule);
  
  //   app.get('/database/:loginName', async (req: any, res: any) => {
    //     const {userQuery} = req.params;
    
    //     const onlyLettersAndNumbers = /^[A-Za-z0-9]+$/;
    //     if (!userQuery.match(onlyLettersAndNumbers)){
//       return res.status(400).json({err: "Numbers and letters! No funny business here!"})
//     }

//     const query = `SELECT * FROM Repository WHERE TAG = '${userQuery}' AND public = 1`;
//     const [rows] = connection.query(query, [userQuery]);
//     res.json(rows);
//   })
  
// Enable CORS for all routes (this app will turn on port 3001 (backend), but the frontend and database
  // will run on a different port, so it's good to add all other origin ports running (i.e.: that will
  // try to access/send requests to the backend) as a Cors option).
  app.enableCors({
    // origin: ['http://localhost:3000','http://localhost:3001', 'http://localhost:5432'],
    // origin: [`${process.env.FRONTEND}`, `${process.env.BACKEND}`, `${process.env.DATABASE}`],
    origin: [`${process.env.FRONTEND}`, `${process.env.DATABASE}`],
    methods: ['GET', 'POST', 'DELETE'],   // add 'HEAD', 'PUT', 'PATCH', 'POST', 'OPTIONS' ?
    credentials: true,
  });
  
  
  // // mysql - for sql injections
  // // ---------------------------------------------------------------

  // app.get('')
  // // ---------------------------------------------------------------



  // To globally validate user's input, ie: changing profileName ... @maxLength, etc 
  app.useGlobalPipes(new ValidationPipe());

  // To enable backend server to serve static files from the folder where uploaded images are stored
  app.use('/uploads', express.static('uploads'));
  app.use('/resources', express.static('resources'));
  app.use('/uploadsDummies', express.static('uploadsDummies'));

  // this allows the AuthGuard to be used globally so that we don't have to add the decorator to every single controller
  // app.useGlobalGuards(new AuthGuard(new DataSource({type: "postgres"}), new UserService(new UserRepository), new JwtService,  new Reflector));
  // app.useGlobalGuards(new AuthGuard(new JwtService,  new Reflector));
  // app.useGlobalFilters(new UnauthorizedExceptionFilter());
	app.use(cookieParser());

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', ['http://localhost:3000/','http://localhost:3001/', 'http://localhost:5432'] );
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   next();
  // });

  //await app.listen(`${process.env.BACKEND_PORT}`);
  await app.listen(process.env.BACKEND_PORT);
  logger.log('--------------------------> Backend configured and listening on port ' + process.env.BACKEND_PORT);
}
main();
