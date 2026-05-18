import type { GameCommand, GameEvent } from "@bcgs/shared";
import { BaseAuthoritativeRoom } from "./base-authoritative.room.js";
import { LudoEngine, type LudoState } from "../engine/ludo.engine.js";

export class LudoRoom extends BaseAuthoritativeRoom<LudoState> {
  protected readonly game = "ludo" as const;
  private readonly engine = new LudoEngine();

  createInitialState(options: { seats?: number }): LudoState {
    return this.engine.initialState(options.seats ?? 4);
  }

  applyCommand(command: GameCommand): GameEvent[] {
    return this.engine.apply(this.state, command as GameCommand<{ pieceIndex?: number; roll?: number }>);
  }
}
