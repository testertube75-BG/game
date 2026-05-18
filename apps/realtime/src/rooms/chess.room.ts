import type { GameCommand, GameEvent } from "@bcgs/shared";
import { BaseAuthoritativeRoom } from "./base-authoritative.room.js";
import { ChessEngine, type ChessState } from "../engine/chess.engine.js";

export class ChessRoom extends BaseAuthoritativeRoom<ChessState> {
  protected readonly game = "chess" as const;
  private readonly engine = new ChessEngine();

  createInitialState(): ChessState {
    return this.engine.initialState();
  }

  applyCommand(command: GameCommand): GameEvent[] {
    return this.engine.apply(this.state, command as GameCommand<{ from: string; to: string; promotion?: string }>);
  }
}
