import type { GameCommand, GameEvent } from "@bcgs/shared";

export interface LudoState {
  currentSeat: number;
  seats: number;
  dice?: number;
  pieces: Record<string, number[]>;
}

export class LudoEngine {
  initialState(seats = 4): LudoState {
    return { currentSeat: 0, seats, pieces: {} };
  }

  apply(state: LudoState, command: GameCommand<{ pieceIndex?: number; roll?: number }>): GameEvent[] {
    if (command.type === "roll") {
      const roll = command.payload.roll ?? 1 + Math.floor(Math.random() * 6);
      state.dice = roll;
      return [{ eventId: "", roomId: "", serverTick: 0, type: "dice_rolled", payload: { roll }, createdAt: "" }];
    }

    if (command.type === "move_piece" && state.dice) {
      const pieces = (state.pieces[command.playerId] ??= [0, 0, 0, 0]);
      const index = command.payload.pieceIndex ?? 0;
      pieces[index] = Math.min(57, (pieces[index] ?? 0) + state.dice);
      state.currentSeat = (state.currentSeat + 1) % state.seats;
      state.dice = undefined;
      return [{ eventId: "", roomId: "", serverTick: 0, type: "piece_moved", payload: state, createdAt: "" }];
    }

    return [{ eventId: "", roomId: "", serverTick: 0, type: "command_rejected", payload: { reason: "invalid_turn_flow" }, createdAt: "" }];
  }
}
