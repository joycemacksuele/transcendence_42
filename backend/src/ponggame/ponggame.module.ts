import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PonggameService } from "./ponggame.service";
import { PonggameGateway } from "./ponggame.gateway";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { TwoFactorAuthService } from "src/auth/2fa/2fa.service";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { UserEntity } from "src/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [PonggameGateway, PonggameService, UserService, AuthService, JwtService, TwoFactorAuthService],
})
export class PonggameModule {}
