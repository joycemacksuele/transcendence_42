/*
  This is the main file, together with app.module.ts.
  It is the entry point of the application, it attaches the 'AppModule' and creates an instance of 'NestApplication'
*/

import { NestFactory } from '@nestjs/core';
import { MyAppModule } from './app/app.module';
import Console from "console";

async function main() {
  Console.log('[LOG] main');

  const app = await NestFactory.create(MyAppModule);

  app.enableCors(); // added jaka: Enable CORS for all routes

  await app.listen(3001);
}
main();
