import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles, RolesGuard } from "../common/roles.guard.js";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class AdminController {
  @Get("health")
  health() {
    return {
      usersOnline: 0,
      activeRooms: 0,
      walletQueueDepth: 0,
      antiCheatSignals24h: 0
    };
  }

  @Get("anti-cheat/events")
  antiCheatEvents() {
    return { events: [] };
  }
}
