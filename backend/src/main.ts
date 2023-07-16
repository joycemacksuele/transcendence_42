/*
  This is the main file, together with app.module.ts.
  It is the entry point of the application, it attaches the 'AppModule' and creates an instance of 'NestApplication'
*/

import { NestFactory } from '@nestjs/core';
import { MyAppModule } from './app/app.module';

async function main() {
  console.log('[LOG] main');

  const app = await NestFactory.create(MyAppModule);

  // Enable CORS for all routes (this app will turn on port 3001, but the frontend and database will
  // run on a different port, so its good to add all other origin ports running (i.e.: that will
  // try to access/send requests to the backend) as a Cors option).
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5432']// TODO: change 3000 for a macro or from .env
    // 3000 -> ReactJS (frontend)
    // 5432 -> PostgreQSL (database)
  });

  // Backend will be listening (for incoming requests) on port 3001
  // TODO: change this value to a macro or from the .env
  await app.listen(3001);
}
main();
