// Added Jaka
// To enable .env to be visible globaly, to get the TOKEN value
// If you need values from .env, you import 'ConfigService' in that file


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module global
    }),
  ],
})
export class AppConfigModule {}
