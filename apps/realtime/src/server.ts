import express from "express";
import { createServer } from "node:http";
import { Server } from "colyseus";
import { ChessRoom } from "./rooms/chess.room.js";
import { LudoRoom } from "./rooms/ludo.room.js";
import { TashRoom } from "./rooms/tash.room.js";

const app = express();
app.get("/healthz", (_req, res) => res.json({ ok: true }));

const gameServer = new Server({
  server: createServer(app),
  presence: undefined
});

gameServer.define("chess", ChessRoom).filterBy(["region", "stakeToken"]);
gameServer.define("ludo", LudoRoom).filterBy(["region", "stakeToken"]);
gameServer.define("tash", TashRoom).filterBy(["region", "stakeToken"]);

const port = Number(process.env.REALTIME_PORT ?? 2567);
gameServer.listen(port);
