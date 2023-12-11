/*
  This is the main file, together with app.module.ts. It is the entry point of the
  application, it attaches the 'AppModule' and creates an instance of 'NestApplication'.
*/

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { AuthService } from './auth/auth.service';
import { DataSource } from "typeorm";
// import { ConfigModule } from '@nestjs/config';
// import { AuthGuard } from './auth/guards/auth.guard';
// import { UnauthorizedExceptionFilter } from './auth/guards/auth.exception.filter';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import {Logger, ValidationPipe} from '@nestjs/common'

async function main() {
  let logger = new Logger(main.name);

  const app = await NestFactory.create(AppModule);

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
  
  // To globally validate user's input, ie: changing profileName ... @maxLength, etc 
  app.useGlobalPipes(new ValidationPipe());

  // To enable backend server to serve static files from the folder where uploaded images are stored
  // todo: replace with .env
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
