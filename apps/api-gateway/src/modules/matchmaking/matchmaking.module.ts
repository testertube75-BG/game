import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { MatchmakingController } from "./matchmaking.controller.js";
import { MatchmakingService } from "./matchmaking.service.js";

@Module({
  imports: [AuthModule],
  controllers: [MatchmakingController],
  providers: [MatchmakingService]
})
export class MatchmakingModule {}
