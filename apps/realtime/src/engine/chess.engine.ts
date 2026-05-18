import type { GameCommand, GameEvent } from "@bcgs/shared";
import { Chess } from "chess.js";

export interface ChessState {
  fen: string;
  pgn: string;
  turn: "white" | "black";
  moveNumber: number;
  players: { white?: string; black?: string };
  result?: string;
}

export class ChessEngine {
  initialState(): ChessState {
    const chess = new Chess();
    return {
      fen: chess.fen(),
      pgn: chess.pgn(),
      turn: "white",
      moveNumber: 1,
      players: {}
    };
  }

  apply(state: ChessState, command: GameCommand<{ from: string; to: string; promotion?: string }>): GameEvent[] {
    if (command.type !== "move") return [];

    const chess = new Chess(state.fen);
    try {
      chess.move({
        from: command.payload.from,
        to: command.payload.to,
        promotion: command.payload.promotion
      });
    } catch {
      return [{ eventId: "", roomId: "", serverTick: 0, type: "move_rejected", payload: { reason: "illegal_move" }, createdAt: "" }];
    }

    state.fen = chess.fen();
    state.pgn = chess.pgn();
    state.turn = chess.turn() === "w" ? "white" : "black";
    state.moveNumber = Number(state.fen.split(" ")[5] ?? 1);
    state.result = this.result(chess);

    return [{ eventId: "", roomId: "", serverTick: 0, type: "move_accepted", payload: state, createdAt: "" }];
  }

  private result(chess: Chess): string | undefined {
    if (chess.isCheckmate()) return chess.turn() === "w" ? "black_win" : "white_win";
    if (chess.isDraw()) return "draw";
    return undefined;
  }
}
