import type { GameCommand, GameEvent } from "@bcgs/shared";

export interface TashState {
  round: number;
  turnIndex: number;
  players: string[];
  potAtomic: string;
  table: Array<{ playerId: string; card: string }>;
}

export class TashEngine {
  initialState(): TashState {
    return { round: 1, turnIndex: 0, players: [], potAtomic: "0", table: [] };
  }

  apply(state: TashState, command: GameCommand<{ card?: string; amountAtomic?: string }>): GameEvent[] {
    if (command.type === "play_card" && command.payload.card) {
      state.table.push({ playerId: command.playerId, card: command.payload.card });
      state.turnIndex = (state.turnIndex + 1) % Math.max(1, state.players.length);
      return [{ eventId: "", roomId: "", serverTick: 0, type: "card_played", payload: state, createdAt: "" }];
    }

    if (command.type === "stake" && command.payload.amountAtomic) {
      state.potAtomic = (BigInt(state.potAtomic) + BigInt(command.payload.amountAtomic)).toString();
      return [{ eventId: "", roomId: "", serverTick: 0, type: "stake_added", payload: { potAtomic: state.potAtomic }, createdAt: "" }];
    }

    return [{ eventId: "", roomId: "", serverTick: 0, type: "command_rejected", payload: { reason: "unsupported_tash_command" }, createdAt: "" }];
  }
}
