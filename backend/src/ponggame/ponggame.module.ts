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
import { MatchService } from "src/matches/match.service";
import { MatchModule } from "src/matches/match.module";
import { MatchEntity } from "src/matches/match.entity";




@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, TypeOrmModule.forFeature([MatchEntity]),MatchModule],
  providers: [PonggameGateway, PonggameService, UserService, MatchService, AuthService, JwtService, TwoFactorAuthService],
})
export class PonggameModule {}
