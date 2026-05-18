import test from "node:test";
import assert from "node:assert/strict";
import { ChessEngine } from "./chess.engine.js";

test("accepts legal chess moves and rejects illegal moves", () => {
  const engine = new ChessEngine();
  const state = engine.initialState();

  const accepted = engine.apply(state, {
    commandId: "1",
    roomId: "room",
    playerId: "white",
    sequence: 1,
    type: "move",
    payload: { from: "e2", to: "e4" },
    clientSentAt: new Date().toISOString()
  });

  assert.equal(accepted[0]?.type, "move_accepted");
  assert.equal(state.turn, "black");

  const rejected = engine.apply(state, {
    commandId: "2",
    roomId: "room",
    playerId: "black",
    sequence: 2,
    type: "move",
    payload: { from: "e7", to: "e1" },
    clientSentAt: new Date().toISOString()
  });

  assert.equal(rejected[0]?.type, "move_rejected");
});
