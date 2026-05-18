import type { GameCommand, GameEvent } from "@bcgs/shared";
import { BaseAuthoritativeRoom } from "./base-authoritative.room.js";
import { TashEngine, type TashState } from "../engine/tash.engine.js";

export class TashRoom extends BaseAuthoritativeRoom<TashState> {
  protected readonly game = "tash" as const;
  private readonly engine = new TashEngine();

  createInitialState(): TashState {
    return this.engine.initialState();
  }

  applyCommand(command: GameCommand): GameEvent[] {
    return this.engine.apply(this.state, command as GameCommand<{ card?: string; amountAtomic?: string }>);
  }
}
