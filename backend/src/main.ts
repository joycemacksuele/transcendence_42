/*
  This is the main file, together with app.module.ts.
  It is the entry point of the application, it attaches the 'AppModule' and creates an instance of 'NestApplication'
*/

import { NestFactory } from '@nestjs/core';
import { myAppModule } from './app/app.module';
import Console from "console";

async function bootstrap() {
  Console.log('LOG MAIN');

  const app = await NestFactory.create(myAppModule);

  app.enableCors(); // added jaka: Enable CORS for all routes

  await app.listen(3001);
}
bootstrap();
