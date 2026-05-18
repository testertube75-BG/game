import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { MatchTicket } from "@bcgs/shared";

@Injectable()
export class MatchmakingService {
  private readonly tickets = new Map<string, MatchTicket>();

  async createTicket(userId: string, input: Omit<MatchTicket, "id" | "userId" | "createdAt">) {
    const ticket: MatchTicket = {
      id: randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      ...input
    };
    this.tickets.set(ticket.id, ticket);
    return { ticket, estimatedWaitMs: this.estimateWait(ticket) };
  }

  async cancelTicket(ticketId: string) {
    return { cancelled: this.tickets.delete(ticketId) };
  }

  private estimateWait(ticket: MatchTicket): number {
    const samePool = [...this.tickets.values()].filter(
      (candidate) => candidate.game === ticket.game && candidate.region === ticket.region
    );
    return Math.max(1000, 12_000 - samePool.length * 500);
  }
}
