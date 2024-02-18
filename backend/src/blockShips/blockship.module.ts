import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blockship } from "./blockship.entity";
import { BlockshipController } from "./blockship.controller"
import { BlockshipService } from "./blockship.service"
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";
// import { AuthService } from "src/auth/auth.service";
// import { UserService } from "src/user/user.service";
// import { JwtService } from "@nestjs/jwt";
// import { TwoFactorAuthService } from "src/auth/2fa/2fa.service";
// import { UserRepository } from "src/user/user.repository";


@Module({
	imports: [
		TypeOrmModule.forFeature([Blockship]),
		UserModule,
		AuthModule
	],
	// providers: [BlockshipService, AuthService, UserService, JwtService, TwoFactorAuthService, UserRepository],
	providers: [BlockshipService],

	controllers: [BlockshipController]
})

export class BlockshipModule {}
