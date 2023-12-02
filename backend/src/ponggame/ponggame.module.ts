import { Module } from "@nestjs/common";
import { PonggameService } from "./ponggame.service";
import { PonggameGateway } from "./ponggame.gateway";
import { JwtService } from "@nestjs/jwt";
@Module({
  providers: [PonggameGateway, PonggameService, JwtService],
})
export class PonggameModule {}
