import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import type { TournamentConfig } from "@bcgs/shared";

@Injectable()
export class TournamentService {
  private readonly tournaments: TournamentConfig[] = [
    {
      id: randomUUID(),
      game: "chess",
      name: "BCGS Daily Chess Arena",
      startsAt: new Date(Date.now() + 86_400_000).toISOString(),
      maxPlayers: 1024,
      entryAsset: "BCGS",
      entryAmountAtomic: "1000000000000000000",
      prizePoolAtomic: "750000000000000000000",
      format: "swiss"
    }
  ];

  async listPublic() {
    return { tournaments: this.tournaments };
  }

  async enter(id: string, userId: string) {
    const tournament = this.tournaments.find((candidate) => candidate.id === id);
    if (!tournament) throw new NotFoundException("Tournament not found");
    return { tournamentId: id, userId, status: "registered" };
  }
}
