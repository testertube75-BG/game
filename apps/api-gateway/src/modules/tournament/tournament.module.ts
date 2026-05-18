import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { TournamentController } from "./tournament.controller.js";
import { TournamentService } from "./tournament.service.js";

@Module({
  imports: [AuthModule],
  controllers: [TournamentController],
  providers: [TournamentService]
})
export class TournamentModule {}
