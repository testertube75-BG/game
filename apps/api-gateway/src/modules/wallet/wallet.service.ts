import { randomUUID } from "node:crypto";
import { ConflictException, Injectable } from "@nestjs/common";

interface WithdrawalRequest {
  asset: "CORE" | "BCGS";
  amountAtomic: string;
  destination: string;
  idempotencyKey: string;
}

@Injectable()
export class WalletService {
  private readonly idempotency = new Set<string>();

  async getBalances(userId: string) {
    return {
      userId,
      balances: [
        { asset: "CORE", availableAtomic: "0", lockedAtomic: "0" },
        { asset: "BCGS", availableAtomic: "0", lockedAtomic: "0" }
      ]
    };
  }

  async requestWithdrawal(userId: string, request: WithdrawalRequest) {
    if (this.idempotency.has(request.idempotencyKey)) {
      throw new ConflictException("Duplicate withdrawal request");
    }
    this.idempotency.add(request.idempotencyKey);

    return {
      id: randomUUID(),
      userId,
      status: "pending_review",
      asset: request.asset,
      amountAtomic: request.amountAtomic,
      destination: request.destination
    };
  }
}
