import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AdminModule } from "./admin/admin.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { MatchmakingModule } from "./matchmaking/matchmaking.module.js";
import { TournamentModule } from "./tournament/tournament.module.js";
import { WalletModule } from "./wallet/wallet.module.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_DURATION_SECONDS ?? 60) * 1000,
        limit: Number(process.env.RATE_LIMIT_POINTS ?? 120)
      }
    ]),
    AuthModule,
    HealthModule,
    MatchmakingModule,
    WalletModule,
    TournamentModule,
    AdminModule
  ]
})
export class AppModule {}
