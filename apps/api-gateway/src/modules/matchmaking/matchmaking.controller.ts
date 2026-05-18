import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
import { IsIn, IsInt, IsString, Min } from "class-validator";
import type { AuthenticatedUser, GameKind } from "@bcgs/shared";
import { CurrentUser } from "../common/current-user.decorator.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { MatchmakingService } from "./matchmaking.service.js";

class TicketDto {
  @IsIn(["chess", "ludo", "tash"])
  game!: GameKind;

  @IsString()
  region!: string;

  @IsInt()
  @Min(0)
  skillRating!: number;

  @IsIn(["CORE", "BCGS", "FREE"])
  stakeToken!: "CORE" | "BCGS" | "FREE";

  @IsString()
  stakeAmount!: string;
}

@Controller("matchmaking")
@UseGuards(JwtAuthGuard)
export class MatchmakingController {
  constructor(private readonly matchmaking: MatchmakingService) {}

  @Post("tickets")
  createTicket(@CurrentUser() user: AuthenticatedUser, @Body() dto: TicketDto) {
    return this.matchmaking.createTicket(user.id, dto);
  }

  @Delete("tickets/:ticketId")
  cancelTicket(@Param("ticketId") ticketId: string) {
    return this.matchmaking.cancelTicket(ticketId);
  }
}
