import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import type { AuthenticatedUser } from "@bcgs/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CurrentUser } from "../common/current-user.decorator.js";
import { TournamentService } from "./tournament.service.js";

@Controller("tournaments")
export class TournamentController {
  constructor(private readonly tournaments: TournamentService) {}

  @Get()
  list() {
    return this.tournaments.listPublic();
  }

  @Post(":id/entries")
  @UseGuards(JwtAuthGuard)
  enter(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.tournaments.enter(id, user.id);
  }
}
